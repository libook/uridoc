/**
 * Convert structure to markdown format.
 */

'use strict';

/**
 * Structure to markdown
 * @param {URIDOM} uridom
 * @return {string}
 * @constructor
 */
module.exports = function (uridom) {
    let markdown = '\n---\n';

    markdown += `# ${uridom.method} ${uridom.uri}\n\n`;

    markdown += `${uridom.description.replace(/\n/gm, '\n\n')}\n\n`;

    /**
     * Make table.
     * @param {String} objectName
     * @param {Array} objectArray - Array of object which contain name, type and description.
     * @return {string}
     */
    function keyValueTable(objectName, objectArray) {
        let tableString = '';
        tableString += `### ${objectName} ⮷\n\n`;
        tableString += ''
            + 'Name | Description\n'
            + '---- | -----------\n';
        for (let line of objectArray) {
            tableString += `${line.key} | ${line.value}\n`;
        }
        tableString += '\n';
        return tableString;
    }

    function body2Markdown(body) {
        return '### BODY ⮷\n\n'
            + '```javascript\n'
            + body + '\n'
            + '```\n\n';
    }

    if (uridom.request) {
        markdown += '## REQUEST ⮚\n\n';
        if (uridom.request.headers) {
            markdown += keyValueTable('HEADERS', uridom.request.headers.table);
        }
        if (uridom.request.path) {
            markdown += keyValueTable('PATH', uridom.request.path.table);
        }
        if (uridom.request.query) {
            markdown += keyValueTable('QUERY', uridom.request.query.table);
        }
        if (uridom.request.body) {
            markdown += body2Markdown(uridom.request.body.bodyContent);
        }
    }
    if (uridom.response) {
        markdown += '## RESPONSE ⮘\n\n';
        if (uridom.response.headers) {
            markdown += keyValueTable('HEADERS', uridom.request.headers.table);
        }
        if (uridom.response.body) {
            markdown += body2Markdown(uridom.response.body.bodyContent)
        }
    }
    return markdown;
};
