# URI Doc

An URI document generator which works with JSDoc-type comments.

## Usage

### Installation

```sh
npm install -g uridoc
```

### Run

```sh
uridoc FileWithUriDefinition.js Document.md
```

## URI Definition Demo

```javascript
/**
 * @uri
 * This is a test API.
 * Just for testing.
 * @get /api/v1/:param1/test/:param2
 * @request
 *      @headers
 *          {String} header1 - First header.
 *          {Number} header2 - Second header.
 *      @params
 *          {String} param1 - First param.
 *          {Number} param2 - Second param.
 *      @query
 *          {String} query1 - First query.
 *          {Number} query2 - Second query.
 *      @body
 *          {
 *              "a": {String},
 *              "b": {Number}
 *          }
 * @response
 *      @headers
 *          {String} rheader1 - First header.
 *          {Number} rheader2 - Second header
 *      @body
 *          {
 *              "c": {String},
 *              "d": {Number}
 *          }
 */
```

## GET /api/v1/:param1/test/:param2

This is a test API.

Just for testing.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
header1 | {String} | First header.
header2 | {Number} | Second header.

#### Headers:

Name | Type | Description
---- | ---- | -----------
param1 | {String} | First param.
param2 | {Number} | Second param.

#### Headers:

Name | Type | Description
---- | ---- | -----------
query1 | {String} | First query.
query2 | {Number} | Second query.

#### Body:

```javascript
{
  "a": {String},
  "b": {Number}
}
```

### Response:

#### Headers:

Name | Type | Description
---- | ---- | -----------
header1 | {String} | First header.
header2 | {Number} | Second header.

#### Body:

```javascript
{
  "c": {String},
  "d": {Number}
}
```
