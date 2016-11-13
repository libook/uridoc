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
 * 这是一个测试API
 * 主要用于测试
 * @get /api/v1/:param1/test/:param2
 * @request
 *      @headers
 *          {String} header1 - 头1
 *          {Number} header2 - 头2
 *      @params
 *          {String} param1 - 参数1
 *          {Number} param2 - 参数2
 *      @query
 *          {String} query1 - 查询1
 *          {Number} query2 - 查询2
 *      @body
 *          {
 *              "a": {String},
 *              "b": {Number}
 *          }
 * @response
 *      @headers
 *          {String} rheader1 - 返回头1
 *          {Number} rheader2 - 返回头2
 *      @body
 *          {
 *              "c": {String},
 *              "d": {Number}
 *          }
 */
```

## GET /api/v1/:param1/test/:param2

这是一个测试API
主要用于测试

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
header1 | {String} | 头1
header2 | {Number} | 头2

#### Headers:

Name | Type | Description
---- | ---- | -----------
param1 | {String} | 参数1
param2 | {Number} | 参数2

#### Headers:

Name | Type | Description
---- | ---- | -----------
query1 | {String} | 查询1
query2 | {Number} | 查询2

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
header1 | {String} | 头1
header2 | {Number} | 头2

#### Body:

```javascript
{
  "c": {String},
  "d": {Number}
}
```
