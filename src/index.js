#!/usr/bin/env node

/**
 * The entrance.
 */

'use strict';

/**
 * Import modules.
 */

const getUridomList = require('./getUridomList');
const convertToMarkdown = require('./convertToMarkdown');
const writeFiles = require('./writeFiles');

/**
 * Run.
 */
(async () => {
    const uridomList = await getUridomList();
    let markdownString = '';
    for (let uridom of uridomList) {
        markdownString += convertToMarkdown(uridom) + '\n';
    }
    await writeFiles(process.argv[3], markdownString);
})();
