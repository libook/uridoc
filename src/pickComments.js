/**
 * Pick valuable comments.
 */

'use strict';

module.exports = (content) => {
    const matches = content
        .match(/\/\*([^*]|(\*)*[^*/])*(\*)*\*\//g);
    if (matches !== null) {
        return matches.filter((comment) => (comment.indexOf('@uri') >= 0))
            .map((comment) => comment
                .replace(/\/[*]+/g, '')// Remove start-of-comment command.
                .replace(/\*\//g, '')// Remove end-of-comment command.
                .replace(/@uri/g, '')// Remove "@uri".
                .replace(/[\n]{2,}/mg, '\n')// Replace consecutive newline to one newline.
                .trim());
    } else {
        return [];
    }
};
