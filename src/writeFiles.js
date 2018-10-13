/**
 * Write files here.
 */

'use strict';

/**
 * Including modules.
 */
const FS = require('fs');

/**
 * Write a file.
 * @param {String} path
 * @param {String} str
 * @return {Promise}
 */
module.exports = function (path, str) {
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
