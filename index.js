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
 * This is a test API.
 * Just for testing.
 * @get /api/v1/:param1/test/:param2
 * @request
 *      @headers
 *          {String} header1 - First header.
 *          {Number} header2 - Second header.
 *      @params
 *          {String} param1 - First param.
 *          {Number} param2 - Second param.
 *      @query
 *          {String} query1 - First query.
 *          {Number} query2 - Second query.
 *      @body
 *          {
 *              "a": {String},
 *              "b": {Number}
 *          }
 * @response
 *      @headers
 *          {String} rheader1 - First header.
 *          {Number} rheader2 - Second header
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
    return lines.join('\n\n');
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

/**
 * JSON to markdown
 * @param {Object} json
 * @return {string}
 * @constructor
 */
let JSON2markdown = function (json) {
    let markdown = '';

    markdown += '## ' + json.method.toUpperCase() + ' ' + json.uri + '\n\n';

    markdown += json.description + '\n\n';

    /**
     * Make table.
     * @param {String} objectName
     * @param {Array} objectArray - Array of object which contain name, type and description.
     * @return {string}
     */
    function keyValueTable(objectName, objectArray) {
        let tableString = '';
        tableString += '#### ' + objectName + ':\n\n';
        tableString += ''
            + 'Name | Type | Description\n'
            + '---- | ---- | -----------\n';
        for (let line of objectArray) {
            tableString += line.name + ' | ' + line.type + ' | ' + line.description + '\n';
        }
        tableString += '\n';
        return tableString;
    }

    if (json.request) {
        markdown += '### Request:\n\n';
        if (json.request.headers) {
            markdown += keyValueTable('Headers', json.request.headers);
        }
        if (json.request.params) {
            markdown += keyValueTable('Headers', json.request.params);
        }
        if (json.request.query) {
            markdown += keyValueTable('Headers', json.request.query);
        }
        if (json.request.body) {
            markdown += '#### Body:\n\n'
                + '```javascript\n'
                + json.request.body + '\n'
                + '```\n\n';
        }
    }
    if (json.response) {
        markdown += '### Response:\n\n';
        if (json.response.headers) {
            markdown += keyValueTable('Headers', json.request.headers);
        }
        if (json.response.body) {
            markdown += '#### Body:\n\n'
                + '```javascript\n'
                + json.response.body + '\n'
                + '```\n\n';
        }
    }
    return markdown;
};

/**
 * Promise for FS.appendFile
 * @param {String} path - File path
 * @param {String} data - Content
 * @return {Promise}
 */
let appendFile = function (path, data) {
    return new Promise(function (resolve, reject) {
        FS.appendFile(path, data, 'utf8', function (error, content) {
            if (error) {
                reject(error);
            } else {
                resolve(content);
            }
        });
    });
};

co(function *() {
    let content = yield readFile(process.argv[2]);
    let targetFile = process.argv[3];
    let matches = pickJSDocs(content);
    let uriDocStrings = filterUri(matches);
    for (let uriDocString of uriDocStrings) {
        let lines = splitDoc(uriDocString);
        let classStrings = classify(lines);
        let docObject = interpreter(classStrings);
        let markdown = JSON2markdown(docObject);
        yield appendFile(targetFile, markdown);
    }
}).catch(function (error) {
    console.error(error.stack);
});
