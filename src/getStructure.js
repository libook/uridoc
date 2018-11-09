/**
 * Get comment structure.
 */

'use strict';

/*
this is content1
@tag1 this is content2
    @tag2 this is child content1
    this is child content2
this is content3

{
    "indentation": "",
    "lines": [
        {
            "content": "this is content1",
        },
        {
            "tag": "tag1",
            "content": "this is content2",
            "children": {
                "indentation": "    ",
                "lines": [
                    {
                        "tag": "tag2",
                        "content": "this is child content1",
                    },
                    {
                        "content": "this is child content2",
                    },
                ],
            },
        },
        {
            "content": "this is content3",
        },
    ]
}
 */

const getIndentation = (line) => {
    if (/[ \t]/.test(line[0])) {
        const firstNonBlankCharacterIndex = line.search(/[^ \t]/);
        return line.slice(0, firstNonBlankCharacterIndex);
    } else {
        return '';
    }
};

const getTag = (line) => {
    const TAG_REGEXP = /((?<=@)[^ \t]+(?=[ \t]))|((?<=@)[^ \t]+$)/;
    const matchResult = line.match(TAG_REGEXP);
    return (matchResult !== null) ? matchResult[0] : undefined;
};

const getPureContent = (line, indentation) => line
    .slice(indentation.length)
    .replace(/(@[^ \t]+[ \t]+)|(@[^ \t]+$)/, '');// Remove tag.

module.exports = (comment) => {
    const lines = comment.split(/\n/);

    const structure = {
        "indentation": getIndentation(lines[0]),
        "lines": [],
    };

    const stack = [];
    stack.unshift(structure);

    /**
     * Get the basic structure.
     */
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        if (line.startsWith(stack[0].indentation)) {
            if (getIndentation(getPureContent(line, stack[0].indentation))) {
                const newSubStructure = {
                    "indentation": getIndentation(line),
                    "lines": [],
                };
                stack[0].lines[stack[0].lines.length - 1].children = newSubStructure;
                stack.unshift(newSubStructure);

            }
            stack[0].lines.push({
                "tag": getTag(line),
                "content": getPureContent(line, stack[0].indentation),
                "children": {},
            });
        } else {
            if (stack.length > 0) {
                stack.shift();
                lineIndex--;
            } else {
                throw new Error('Wrong indentation.');
            }
        }
    }

    return structure;
};
