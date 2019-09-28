/**
 * Get file tree start from this directory.
 */

'use strict';

/**
 * Including modules.
 */
const readFile = require('./readFile');
const pickComments = require('./pickComments');
const getStructure = require('./getStructure');
const glob = require('glob');
const URIDOM = require('./URIDOM');

/**
 * For default RESTful methods.
 * @type {String[]}
 */
const METHOD_SEQUENCE = [
    'OPTIONS',
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'TRACE',
    'CONNECT',
];

/**
 * Compare function for sorting URIDOM list.
 * Default RESTful methods are on the top.
 * @param {URIDOM} a
 * @param {URIDOM} b
 * @returns {number}
 */
const sortUridom = (a, b) => {
    if (a.uri === b.uri) {
        const aSequence = METHOD_SEQUENCE.indexOf(a.method);
        const bSequence = METHOD_SEQUENCE.indexOf(b.method);
        return aSequence - bSequence;
    } else {
        if (a.uri > b.uri) {
            return 1;
        } else {
            return -1;
        }
    }
};

module.exports = async function () {
    const uridomList = [];

    const filePathList = await new Promise((resolve, reject) => {
        glob(process.argv[2], (error, filePathList) => {
            if (error) {
                reject(error);
            } else {
                resolve(filePathList);
            }
        });
    });

    const childrenBranches = [];
    for (let filePath of filePathList) {
        childrenBranches.push(readFile(filePath)
            .then((sourceCode) => pickComments(sourceCode, filePath))
            .then((fileWithContentList) => {
                const structureList = [];
                for (const comment of fileWithContentList.commentList) {
                    structureList.push(getStructure(comment));
                }
                return structureList;
            })
            .then((structureList) => structureList.forEach((structure) => {
                uridomList.push(new URIDOM(structure));
            })));
    }
    await Promise.all(childrenBranches);
    uridomList.sort(sortUridom);
    return uridomList;
};
