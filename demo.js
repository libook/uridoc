/**
 * This is a demo.
 */

/*
@uri
This is a test API.
Just for testing.
@get /api/v1/:part1/test/:part2
@request
    @headers
        header1:First header.
        header2:Second header.
    @path
        part1 - First part.
        part2 - Second part.
    @query
        query1=First query.
        query2=Second query.
    @body application/json
        {
            "a": String,// This is a.
            "b": String,
        }
@response
    @headers
        rheader1:First header.
        rheader2:Second header
    @body
        {
            "c": String,
            "d": Number,
        }
 */
