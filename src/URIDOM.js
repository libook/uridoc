/**
 * This is URI document object model.
 */

'use strict';

class ParameterTable {
    /**
     * @param {object} subStructure
     * @param {object} subStructure.children
     * @param {string} subStructure.content
     * @param {string} subStructure.tag
     * @param {string} separator
     */
    constructor(subStructure, separator) {
        this.table = [];
        for (let keyValueString of subStructure.children.lines) {
            const separatorIndex = keyValueString.content.indexOf(separator);
            if (separatorIndex === -1) {
                throw new Error(`Wrong format at "${keyValueString.content}".`);
            }
            this.table.push({
                "key": keyValueString.content.substring(0, separatorIndex).trim(),
                "value": keyValueString.content.substring(separatorIndex + 1).trim(),
            });
        }
    }
}

const processOneLevel = (subStructure, baseIndentation, father, keyName) => {
    for (let line of subStructure.children.lines) {
        father[keyName] += `${subStructure.children.indentation.replace(new RegExp(`^${baseIndentation}`), '')}${line.content}\n`;
        if (line.children.lines !== undefined) {
            processOneLevel(line, baseIndentation, father, keyName);
        }
    }
};

const MessageParts = {

    "headers": class Headers extends ParameterTable {
        /**
         * @param {object} headersStructure
         * @param {object} headersStructure.children
         * @param {string} headersStructure.content
         * @param {string} headersStructure.tag
         */
        constructor(headersStructure) {
            super(headersStructure, ':');// header1:First header.
        }
    },

    "path": class Path extends ParameterTable {
        /**
         * @param {object} pathStructure
         * @param {object} pathStructure.children
         * @param {string} pathStructure.content
         * @param {string} pathStructure.tag
         */
        constructor(pathStructure) {
            super(pathStructure, '-');// header1:First header.
        }
    },

    "query": class Query extends ParameterTable {
        /**
         * @param {object} queryStructure
         * @param {object} queryStructure.children
         * @param {string} queryStructure.content
         * @param {string} queryStructure.tag
         */
        constructor(queryStructure) {
            super(queryStructure, '=');// header1:First header.
        }
    },

    "body": class Body {
        /**
         * @param {object} bodyStructure
         * @param {object} bodyStructure.children
         * @param {string} bodyStructure.content
         * @param {string} bodyStructure.tag
         */
        constructor(bodyStructure) {
            this.MIMEType = bodyStructure.content || 'application/json';
            this.bodyContent = '';
            if (bodyStructure.children.lines !== undefined) {
                processOneLevel(bodyStructure, bodyStructure.children.indentation, this, 'bodyContent');
            }
        }
    },

};

class Message {
    /**
     * @param {object} messageStructure
     * @param {object} messageStructure.children
     * @param {string} messageStructure.content
     * @param {string} messageStructure.tag
     */
    constructor(messageStructure) {
        for (let line of messageStructure.children.lines) {
            this[line.tag] = new MessageParts[line.tag](line);
        }
    }
}

class Request extends Message {
    /**
     * @param {object} requestStructure
     * @param {object} requestStructure.children
     * @param {string} requestStructure.content
     * @param {string} requestStructure.tag
     */
    constructor(requestStructure) {
        super(requestStructure);
    }
}

class Response extends Message {
    /**
     * @param {object} responseStructure
     * @param {object} responseStructure.children
     * @param {string} responseStructure.content
     * @param {string} responseStructure.tag
     */
    constructor(responseStructure) {
        super(responseStructure);
    }
}

const HTTP_METHOD_LIST = [
    'OPTIONS',
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'TRACE',
    'CONNECT',
];

module.exports = class URIDOM {
    /**
     * @param {object} structure
     * @param {string} structure.indentation
     * @param {array} structure.lines
     */
    constructor(structure) {
        this.description = '';
        this.method = undefined;
        this.uri = '';
        this.request = undefined;
        this.response = undefined;

        for (let line of structure.lines) {
            /**
             * No tag, push into description.
             */
            if (!line.tag) {
                this.description += line.content + '\n';
                if (line.children.lines !== undefined) {
                    processOneLevel(line, line.children.indentation, this, 'description');
                }
            }

            /**
             * HTTP method and URI.
             */
            else if (HTTP_METHOD_LIST.includes(line.tag.toUpperCase())) {
                this.method = line.tag.toUpperCase();//GET POST PUT DELETE
                this.uri = line.content;
            }

            /**
             * Messages.
             */
            else if (line.tag === 'request') {
                this.request = new Request(line);
            } else if (line.tag === 'response') {
                this.response = new Response(line);
            }
        }
    }
};
