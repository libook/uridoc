#!/usr/bin/env node

/**
 * The entrance.
 */

'use strict';

/**
 * Including modules.
 */
const co = require('co')
    , FS = require('fs')
    ;

/**
 * Read a file.
 * @param {String} path
 * @return {Promise}
 */
let readFile = function (path) {
    return new Promise(function (resolve, reject) {
        FS.readFile(path, 'utf8', function (error, content) {
            if (error) {
                reject(error);
            } else {
                resolve(content);
            }
        });
    });
};

/**
 * @uri
 * 这是一个测试API
 * 主要用于测试
 * @get /api/v1/:param1/test/:param2
 * @request
 *      @headers
 *          {String} header1 - 头1
 *          {Number} header2 - 头2
 *      @params
 *          {String} param1 - 参数1
 *          {Number} param2 - 参数2
 *      @query
 *          {String} query1 - 查询1
 *          {Number} query2 - 查询2
 *      @body
 *          {
 *              "a": {String},
 *              "b": {Number}
 *          }
 * @response
 *      @headers
 *          {String} rheader1 - 返回头1
 *          {Number} rheader2 - 返回头2
 *      @body
 *          {
 *              "c": {String},
 *              "d": {Number}
 *          }
 */

/**
 * Match JSDoc.
 * @param {String} content
 * @return {Array|{index: number, input: string}|*}
 */
let pickJSDocs = function (content) {
    return content.match(/\/\*([^*]|(\*)*[^*/])*(\*)*\*\//g);
};

/**
 * Filter strings for URI document.
 * @param stringArray
 * @return {Array}
 */
let filterUri = function (stringArray) {
    let uriArray = [];
    stringArray.forEach(function (element) {
        if (element.indexOf('@uri') >= 0) {
            uriArray.push(element);
        }
    });
    return uriArray;
};

/**
 * Split document by line.
 * @param {String} doc
 * @return {Array|*}
 */
let splitDoc = function (doc) {
    let lines = ('\n' + doc).split(/\n[\t *\/]*/g);
    for (let i = lines.length - 1; i >= 0; i--) {
        let line = lines[i];
        switch (line) {
            case '':
            case '@uri':
                lines.splice(i, 1);
                break;
        }
    }
    return lines;
};

/**
 * Classify lines.
 * @param {Array} lines
 * @return {{}}
 */
let classify = function (lines) {
    let classStrings = {};
    let part;//request||response
    let className = 'description';
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (['@get', '@post', '@put', '@delete'].indexOf(line.replace(/ .*/, '').trim()) >= 0) {
            /**
             * Methods.
             */

            classStrings.method = line.replace(/ .*/, '').replace(/@/g, '').trim();
            classStrings.uri = line.replace(/^[^ ]* /, '').trim();
        } else if (['@request', '@response'].indexOf(line) >= 0) {
            part = line.replace(/@/g, '');
        } else if (line.indexOf('@') === 0) {
            className = line.replace(/@/g, '');
        } else {
            if (part === undefined) {
                if (classStrings[className] === undefined) {
                    classStrings[className] = [];
                }
                classStrings[className].push(line);
            } else {
                if (classStrings[part] === undefined) {
                    classStrings[part] = {};
                }
                if (classStrings[part][className] === undefined) {
                    classStrings[part][className] = [];
                }
                classStrings[part][className].push(line);
            }

        }
    }
    return classStrings;
};

/**
 * Processor of description part.
 * @param {Array} lines
 * @return {string}
 */
let descriptionProcessor = function (lines) {
    return lines.join('\n');
};

/**
 * Loop a part to run processors.
 * This is only for request and response.
 * @param {Object} partStringObject - Original string data.
 * @param {Array} processors - Array of processors.
 * @return {{}}
 */
function loopPart(partStringObject, processors) {
    let partObject = {};
    for (let processor of processors) {
        partObject[processor.name] = processor.processor(partStringObject[processor.name]);
    }
    return partObject;
}

/**
 * Processor for "{Type} name - description" lines.
 * @param {Array} nameValues
 * @return {Array}
 */
function nameValueProcessor(nameValues) {
    let objectArray = [];
    nameValues.forEach(function (nameValue) {
        let paramObject = {};
        let classAndName = nameValue.replace(/ - .*/g, '').trim().split(' ');
        if (classAndName.length > 1) {
            paramObject.type = classAndName[0];
            paramObject.name = classAndName[1];
        } else {
            paramObject.name = classAndName[0];
        }
        paramObject.description = nameValue.replace(/^[^\-]+- /g, '').trim();
        objectArray.push(paramObject);
    });
    return objectArray;
}

/**
 * Processor for json.
 * When this is not valid json, this will return a row string.
 * @param {Array} lines
 * @return {*}
 */
function jsonStringProcessor(lines) {
    let rowString = lines.join('\n');
    let jsonString = rowString.replace(/(\{[^:}]+})/g, '"$1"');
    try {
        let json = JSON.parse(jsonString);
        return JSON.stringify(json, null, 2).replace(/"(\{[^:}]+})"/g, '$1');
    } catch (error) {
        return rowString;
    }
}

let requestProcessors = [
    {
        "name": "headers",
        "processor": nameValueProcessor
    }
    , {
        "name": "params",
        "processor": nameValueProcessor
    }
    , {
        "name": "query",
        "processor": nameValueProcessor
    }
    , {
        "name": "body",
        "processor": jsonStringProcessor
    }
];

let responseProcessors = [
    {
        "name": "headers",
        "processor": nameValueProcessor
    }
    , {
        "name": "body",
        "processor": jsonStringProcessor
    }
];

/**
 * Generate document object.
 * @param {Object} classStrings
 * @return {{}}
 */
let interpreter = function (classStrings) {
    let docObject = JSON.parse(JSON.stringify(classStrings));
    docObject.description = descriptionProcessor(classStrings.description);
    if (classStrings.request !== undefined) {
        docObject.request = loopPart(classStrings.request, requestProcessors);
    }
    if (classStrings.response !== undefined) {
        docObject.response = loopPart(classStrings.response, responseProcessors);
    }
    return docObject;
};

co(function *() {
    let content = yield readFile(process.argv[2]);
    let matches = pickJSDocs(content);
    let uriDocStrings = filterUri(matches);
    let documents = [];
    uriDocStrings.forEach(function (uriDocString) {
        let lines = splitDoc(uriDocString);
        let classStrings = classify(lines);
        let docObject = interpreter(classStrings);
        documents.push(docObject);
    });
    console.log(JSON.stringify(documents, null, 2));
}).catch(function (error) {
    console.error(error.stack);
});
