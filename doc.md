
---
## GET /api/dashboard/teams

Get teams.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

### Response:

#### Body:

```javascript
 [
     {
         "_id": {String},//Team ID.
         "name": {String},//Team name.
     }
 ]
```


---
## POST /api/dashboard/team

Create a team.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Body:

```javascript
 {
     "name": {String},//Team name.
 }
```

### Response:

#### Body:

```javascript
 {
     "_id": {String},//Team ID.
     "name": {String},//Team name.
 }
```


---
## PUT /api/dashboard/team/:teamId

Modify a team.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
teamId | {String} | Team ID.

#### Body:

```javascript
 {
     "name": {String},//Team name.
 }
```

### Response:

#### Body:

```javascript
 {
     "_id": {String},//Team ID.
     "name": {String},//Team name.
 }
```


---
## DELETE /api/dashboard/team/:teamId

Delete a team.

This will delete all relations between schools and this team.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
teamId | {String} | Team ID.

### Response:

#### Body:

```javascript
 {//Team information that has been deleted.
     "_id": {String},//Team ID.
     "name": {String},//Team name.
 }
```


---
## POST /api/dashboard/team/:teamId/report/grand-total/query

Create a query for grand-total report.

Need administrator limit.

Or a team limit for querying anything only belong to this team.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
teamId | {String} | Team ID.

#### Body:

```javascript
 {
     "date": {
         "end": {Number},//Date in millisecond.
     }
 }
```

### Response:

#### Body:

```javascript
 {
     "teamId": {String},//Team ID.
     "userCount": {Number},//Amount of users.
     "revenue": {Number},//Total revenue.
 }
```


---
## POST /api/dashboard/team/:teamId/report/stage/query

Create a query for stage report.

Need administrator limit.

Or a team limit for querying anything only belong to this team.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
teamId | {String} | Team ID.

#### Body:

```javascript
 {
     "date": {
         "begin": {Number},//Date in millisecond.
         "end": {Number},//Date in millisecond.
     }
 }
```

### Response:

#### Body:

```javascript
 {
     "teamId": {String},//Team ID.
     "teacherCount": {Number},//Amount of teachers.
     "studentCount": {Number},//Amount of students.
     "revenue": {Number},//Total revenue.
 }
```


---
## GET /api/dashboard/team/:teamId/schools

Get status of schools that has been captured by the team.

Need administrator limit.

Or a team limit for querying anything only belong to this team.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
teamId | {String} | Team ID.

### Response:

#### Body:

```javascript
 [
     {
         "_id": {String},//School ID.
         "name": {String},//School name.
         "capturedDate": {Number},//Captured date in millisecond.
     }
 ]
```


---
## POST /api/dashboard/schools/query

Create a query for status of schools.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Body:

```javascript
 [
     {String}//School ID.
 ]
```

### Response:

#### Body:

```javascript
 [
     {
         "_id": {String},//School ID.
         "name": {String},//School name.
         "capturedBy": {
             "_id": {String},//Team ID.
             "name": {String},//Team name.
         },
         "captured": {Boolean},//Whether has been captured.
         "capturedDate": {Number},//Captured date in millisecond.
     }
 ]
```


---
## PUT /api/dashboard/school/:schoolId

Mark a school for being captured.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
schoolId | {String} | School ID.

#### Body:

```javascript
 {
     "name": {String},//School name.
     "capturedBy": {String},//Team ID.
     "captured": {Boolean},//Whether has been captured.
     "capturedDate": {Number},//Captured date in millisecond.
 }
```

### Response:

#### Body:

```javascript
 {
     "_id": {String},//School ID.
     "name": {String},//School name.
     "capturedBy": {
         "_id": {String},//Team ID.
         "name": {String},//Team name.
     },
     "captured": {Boolean},//Whether has been captured.
     "capturedDate": {Number},//Captured date in millisecond.
 }
```


---
## DELETE /api/dashboard/school/:schoolId

Delete a relation between school and team.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
schoolId | {String} | School ID.

### Response:

#### Body:

```javascript
 {//School information that has been deleted.
     "_id": {String},//School ID.
     "name": {String},//School name.
     "capturedBy": {
         "_id": {String},//Team ID.
         "name": {String},//Team name.
     },
     "captured": {Boolean},//Whether has been captured.
     "capturedDate": {Number},//Captured date in millisecond.
 }
```


---
## POST /api/dashboard/team/:teamId/url

Create a share link.

Need administrator limit.

### Request:

#### Headers:

Name | Type | Description
---- | ---- | -----------
Authorization | {String} | Token.

#### Headers:

Name | Type | Description
---- | ---- | -----------
teamId | {String} | Team ID.

### Response:

#### Body:

```javascript
 {
     "url": {String},//URL with token.
 }
```

