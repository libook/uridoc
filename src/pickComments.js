/*
Pick valuable comments.
 */

'use strict';

const initComment = (filePath) => ({
    filePath,
    "lineList": [],
});

/*
{
    "filePath": String,
    "commentList": [
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
    ],
}
 */

/**
 * @param {String} content - Whole content of a file
 * @param {String} filePath
 * @returns {{commentList: [Map], filePath: String}} - The key of map of commentList is line number; the value is line content.
 */
module.exports = (content, filePath) => {
    const fileWithContentList = {
        filePath,
        "commentList": [],
    };

    const lineList = content.split('\n');

    let isInComment = false;
    let isUri = false;
    let currentComment = initComment(filePath);
    for (const lineIndex in lineList) {
        const lineContent = lineList[lineIndex];
        if (lineContent.trim().length !== 0) {
            if (!isInComment) {
                if (/\/\*/g.test(lineContent)) {
                    /*
                    This is the start of comment line.
                     */
                    isInComment = true;
                }
            } else {
                if (/\*\//g.test(lineContent)) {
                    /*
                    This is the end of comment line.
                     */
                    isInComment = false;
                    if (isUri && currentComment.lineList.length > 0) {
                        fileWithContentList.commentList.push(currentComment);
                    }
                    isUri = false;
                    currentComment = initComment(filePath);
                } else if (/^@uri$/.test(lineContent.trim())) {
                    /*
                    This is @uri tag line.
                     */
                    isUri = true;
                } else {
                    /*
                    Line in comment.
                     */
                    currentComment.lineList.push({
                        filePath,
                        "number": (Number(lineIndex) + 1),
                        "content": lineContent,
                    });
                }
            }
        }
    }

    return fileWithContentList;
};
