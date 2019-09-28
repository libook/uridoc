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
            .then((sourceCode) => pickComments(sourceCode))
            .then((commentList) => commentList.map(getStructure))
            .then((structureList) => structureList.forEach((structure) => {
                uridomList.push(new URIDOM(structure));
            })));
    }
    await Promise.all(childrenBranches);
    return uridomList;
};
