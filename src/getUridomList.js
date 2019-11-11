/**
 * Get file tree start from this directory.
 */

'use strict';

/**
 * Including modules.
 */
const pickComments = require('pick-comments');
const getStructure = require('./getStructure');
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

    const fileWithCommentAsyncIterator = await pickComments(process.argv[2], 'uri');

    for await (const fileWithComment of fileWithCommentAsyncIterator) {
        for (const comment of fileWithComment.commentList) {
            const structure = getStructure(comment);
            uridomList.push(new URIDOM(structure));
        }
    }
    uridomList.sort(sortUridom);
    return uridomList;
};
