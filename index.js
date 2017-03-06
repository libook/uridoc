#!/usr/bin/env node

/**
 * The entrance.
 */

'use strict';

/**
 * Including modules.
 */
const FS = require('fs');

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
 * Write a file.
 * @param {String} path
 * @param {String} str
 * @return {Promise}
 */
let writeFile = function (path, str) {
    return new Promise(function (resolve, reject) {
        FS.writeFile(path, str, 'utf8', function (error, content) {
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
    let lines = ('\n' + doc).split(/\n[\t ]*[*\/]*/g);
    for (let i = lines.length - 1; i >= 0; i--) {
        let line = lines[i];
        let lineNoSpaceStart = line.replace(/^[\t ]*/g, '');
        switch (lineNoSpaceStart) {
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
        let lineNoSpaceStart = line.replace(/^[\t ]*/g, '');

        if (['@get', '@post', '@put', '@delete'].indexOf(lineNoSpaceStart.replace(/ .*/, '').trim()) >= 0) {
            /**
             * Methods.
             */

            classStrings.method = lineNoSpaceStart.replace(/ .*/, '').replace(/@/g, '').trim();
            classStrings.uri = lineNoSpaceStart.replace(/^[^ ]* /, '').trim();
        } else if (['@request', '@response'].indexOf(lineNoSpaceStart) >= 0) {
            part = lineNoSpaceStart.replace(/@/g, '');
        } else if (lineNoSpaceStart.indexOf('@') === 0) {
            className = lineNoSpaceStart.replace(/@/g, '');
        } else {
            if (part === undefined) {
                if (classStrings[className] === undefined) {
                    classStrings[className] = [];
                }
                classStrings[className].push(lineNoSpaceStart);
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
        let inputParam = partStringObject[processor.name];
        if (inputParam !== undefined) {
            let result = processor.processor(inputParam);
            if (result !== undefined) {
                partObject[processor.name] = result;
            }
        }
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
    // let jsonString = rowString.replace(/(\{[^:}]+})/g, '"$1"');
    // try {
    //     let json = JSON.parse(jsonString);
    //     return JSON.stringify(json, null, 2).replace(/"(\{[^:}]+})"/g, '$1');
    // } catch (error) {
    return rowString;
    // }
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
    let markdown = '\n---\n';

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

    function body2Markdown(body) {
        let alignedBody = '';
        {
            /**
             * Align rows.
             */
            let bodySplited = body.split('\n');
            let removeSpaceCount = null;
            for (let line of bodySplited) {
                let spaceCount = line.replace(/[^ \t].*/g, '').length;
                if (removeSpaceCount === null) {
                    removeSpaceCount = spaceCount;
                } else {
                    if (spaceCount < removeSpaceCount) {
                        removeSpaceCount = spaceCount;
                    }
                }
            }
            let bodySplitedAligned = [];
            for (let line of bodySplited) {
                bodySplitedAligned.push(line.substr(removeSpaceCount - 1));
            }
            alignedBody = bodySplitedAligned.join('\n');
        }

        return '#### Body:\n\n'
            + '```javascript\n'
            + alignedBody + '\n'
            + '```\n\n';
    }

    if (json.request) {
        markdown += '### Request:\n\n';
        if (json.request.headers) {
            markdown += keyValueTable('Headers', json.request.headers);
        }
        if (json.request.params) {
            markdown += keyValueTable('URI Params', json.request.params);
        }
        if (json.request.query) {
            markdown += keyValueTable('Query Params', json.request.query);
        }
        if (json.request.body) {
            markdown += body2Markdown(json.request.body);
        }
    }
    if (json.response) {
        markdown += '### Response:\n\n';
        if (json.response.headers) {
            markdown += keyValueTable('Headers', json.request.headers);
        }
        if (json.response.body) {
            markdown += body2Markdown(json.response.body)
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

async function run() {
    try {
        let content = await readFile(process.argv[2]);
        let targetFile = process.argv[3];
        let matches = pickJSDocs(content);
        let uriDocStrings = filterUri(matches);

        await writeFile(targetFile, '');

        for (let uriDocString of uriDocStrings) {
            let lines = splitDoc(uriDocString);
            let classStrings = classify(lines);
            let docObject = interpreter(classStrings);
            let markdown = JSON2markdown(docObject);
            await appendFile(targetFile, markdown);
        }
    } catch (error) {
        console.error(error.stack)
    }
}

run();
