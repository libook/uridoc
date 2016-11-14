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

