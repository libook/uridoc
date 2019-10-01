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
    .trimRight()
    .slice(indentation.length)
    .replace(/(@[^ \t]+[ \t]+)|(@[^ \t]+$)/, '');// Remove tag.

/*
{
    "filePath": String,
    "lineList": [
        {
            "filePath": String,
            "number": Number,
            "content": String,
        },
    ],
},
 */

module.exports = (comment) => {
    const structure = {
        "indentation": getIndentation(comment.lineList[0].content),
        "lineList": [],
    };

    const stack = [];
    stack.unshift(structure);

    /**
     * Get the basic structure.
     */
    for (let lineIndex = 0; lineIndex < comment.lineList.length; lineIndex++) {
        const line = comment.lineList[lineIndex];
        if (line.content.startsWith(stack[0].indentation)) {
            if (getIndentation(getPureContent(line.content, stack[0].indentation))) {
                const newSubStructure = {
                    "indentation": getIndentation(line.content),
                    "lineList": [],
                };
                stack[0].lineList[stack[0].lineList.length - 1].children = newSubStructure;
                stack.unshift(newSubStructure);

            }
            stack[0].lineList.push({
                "tag": getTag(line.content),
                "content": getPureContent(line.content, stack[0].indentation),
                "children": {},
                "source": {
                    "number": line.number,
                    "filePath": line.filePath,
                },
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
