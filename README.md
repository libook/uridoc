# URI Doc

An URI document generator which works with JSDoc-type comments.

## Usage

### Installation

```sh
npm install -g uridoc
```

### Run

```sh
uridoc ./demo.js Document.md
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
# GET /api/v1/:part1/test/:part2

This is a test API.

Just for testing.



## REQUEST ⮚

### HEADERS ⮷

Name | Description
---- | -----------
header1 | First header.
header2 | Second header.

### PATH ⮷

Name | Description
---- | -----------
part1 | First part.
part2 | Second part.

### QUERY ⮷

Name | Description
---- | -----------
query1 | First query.
query2 | Second query.

### BODY ⮷

```javascript
{
    "a": String,// This is a.
    "b": String,
}

```

## RESPONSE ⮘

### HEADERS ⮷

Name | Description
---- | -----------
header1 | First header.
header2 | Second header.

### BODY ⮷

```javascript
{
    "c": String,
    "d": Number,
}

```
