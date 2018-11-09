/**
 * Read file here.
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
module.exports = (path) => new Promise(function (resolve, reject) {
    FS.readFile(path, 'utf8', function (error, content) {
        if (error) {
            reject(error);
        } else {
            resolve(content);
        }
    });
});
