/**
 * Get file tree start from this directory.
 */

'use strict';

/**
 * Including modules.
 */
const FS = require('fs');
const readFile = require('./readFile');
const pickComments = require('./pickComments');
const getStructure = require('./getStructure');
const URIDOM = require('./URIDOM');

module.exports = async function () {
    /**
     * Ignore file or directory which is listed in .gitignore.
     * @type {*|Array|void}
     */
    const ignoreFileOrDirectoryList = await (async () => {
        try {
            const gitignoreString = await readFile(`${process.cwd()}/.gitignore`);
            return gitignoreString
                .split('\n')
                .filter((line) => (line !== ''))
                .map((line) => line.replace(/^\/+/, '').replace(/\/+$/, ''));
        } catch (error) {
            return [];
        }
    })();

    const uridomList = [];
    const getFileAndDirectoryList = (currentPath) => (new Promise((resolve, reject) => {
        FS.readdir(
            currentPath,
            {
                "withFileTypes": true,
            },
            (error, fileAndDirectoryList) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(fileAndDirectoryList);
                }
            },
        );
    })).then((fileAndDirectoryList) => {
        const fileAndDirectoryListWithoutIgnores = fileAndDirectoryList.filter(
            (fileOrDirectory) => (!ignoreFileOrDirectoryList.includes(fileOrDirectory.name))
        );
        const childrenBranches = [];
        for (let fileOrDirectory of fileAndDirectoryListWithoutIgnores) {
            const fileOrDirectoryPath = `${currentPath}/${fileOrDirectory.name}`;
            if (fileOrDirectory.isDirectory()) {
                childrenBranches.push(getFileAndDirectoryList(fileOrDirectoryPath));
            } else if (fileOrDirectory.isFile() && /^.*\.js$/.test(fileOrDirectory.name)) {
                childrenBranches.push(
                    readFile(fileOrDirectoryPath)
                        .then((sourceCode) => pickComments(sourceCode))
                        .then((commentList) => commentList.map(getStructure))
                        .then((structureList) => structureList.forEach((structure) => {
                            uridomList.push(new URIDOM(structure));
                        }))
                );
            }
        }
        return Promise.all(childrenBranches);
    });
    await getFileAndDirectoryList(process.cwd());
    return uridomList;
};
