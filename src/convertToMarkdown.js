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

    markdown += `### ${uridom.method} ${uridom.uri}\n\n`;

    markdown += `${uridom.description.replace(/\n/gm, '\n\n')}\n\n`;

    /**
     * Make table.
     * @param {String} objectName
     * @param {Array} objectArray - Array of object which contain name, type and description.
     * @return {string}
     */
    function keyValueTable(objectName, objectArray) {
        let tableString = `
##### ${objectName}

Name | Description
---- | -----------
`;
        for (let line of objectArray) {
            tableString += `${line.key} | ${line.value}\n`;
        }
        tableString += '\n';
        return tableString;
    }

    function body2Markdown(body) {
        return `
##### Body

\`\`\`javascript
${body}
\`\`\`
`;
    }

    if (uridom.request) {
        markdown += '#### Request\n\n';
        if (uridom.request.headers) {
            markdown += keyValueTable('Headers', uridom.request.headers.table);
        }
        if (uridom.request.path) {
            markdown += keyValueTable('Path', uridom.request.path.table);
        }
        if (uridom.request.query) {
            markdown += keyValueTable('Query', uridom.request.query.table);
        }
        if (uridom.request.body) {
            markdown += body2Markdown(uridom.request.body.bodyContent);
        }
    }
    if (uridom.response) {
        markdown += '#### Response\n\n';
        if (uridom.response.headers) {
            markdown += keyValueTable('Headers', uridom.request.headers.table);
        }
        if (uridom.response.body) {
            markdown += body2Markdown(uridom.response.body.bodyContent);
        }
    }
    return markdown;
};
