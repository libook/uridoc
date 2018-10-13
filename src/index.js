#!/usr/bin/env node

/**
 * The entrance.
 */

'use strict';

/**
 * Import modules.
 */

const readFiles = require('./readFiles');
const pickComments = require('./pickComments');
const getStructure = require('./getStructure');
const convertToMarkdown = require('./convertToMarkdown');
const writeFiles = require('./writeFiles');
const URIDOM = require('./URIDOM');

/**
 * Run.
 */
(async () => {
    const sourceCode = await readFiles(process.argv[2]);
    const commentList = pickComments(sourceCode);
    let markdownString = '';
    for (let comment of commentList) {
        const structure = getStructure(comment);
        const uridom = new URIDOM(structure);
        markdownString += convertToMarkdown(uridom) + '\n';
    }
    await writeFiles(process.argv[3], markdownString);
})();
