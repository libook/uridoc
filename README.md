# URI Doc

Generate URI document from comments.

## Usage

### Installation

```sh
npm install -g uridoc
```

### Run

```sh
uridoc ./demo.js Document.md
```

Also support glob(must be with quotation marks):

```sh
uridoc "./**/*Routes.js" Document.md
```

## URI Definition Demo

```javascript
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
```


---
### GET /api/v1/:part1/test/:part2

This is a test API.

Just for testing.



#### Request


##### Headers

Name | Description
---- | -----------
header1 | First header.
header2 | Second header.


##### Path

Name | Description
---- | -----------
part1 | First part.
part2 | Second part.


##### Query

Name | Description
---- | -----------
query1 | First query.
query2 | Second query.


##### Body

```javascript
{
    "a": String,// This is a.
    "b": String,
}
```
#### Response


##### Headers

Name | Description
---- | -----------
header1 | First header.
header2 | Second header.


##### Body

```javascript
{
    "c": String,
    "d": Number,
}
```
