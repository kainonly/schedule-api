# Schedule api

a scheduled dispatch management service, `1.x` branch uses leveldb as a bottleneck in log storage performance

[![Docker Pulls](https://img.shields.io/docker/pulls/kainonly/schedule-api.svg?style=flat-square)](https://hub.docker.com/r/kainonly/schedule-api)
[![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/kainonly/schedule-api.svg?style=flat-square)](https://hub.docker.com/r/kainonly/schedule-api)
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/kainonly/schedule-api.svg?style=flat-square)](https://hub.docker.com/r/kainonly/schedule-api)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg?style=flat-square)](https://github.com/kainonly/schedule-api)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/kainonly/schedule-api/master/LICENSE)

```shell
docker pull kainonly/schedule-api
```

## Docker Compose

```yml
version: '3.7'
services:
  schedule:
    image: kainonly/schedule-api
    restart: always
    environment: 
      ELASTIC: "http://elasticsearch:9200"
    volumes: 
      - ./schedule:/app/data
    ports:
      - 3000:3000
```

## Environment

- **ELASTIC** `string` elasticsearch url

## Api docs

Assume that the underlying request path is `http://localhost:3000`

#### Put Job

- url `/put`
- method `POST`
- body
  - **identity** `string` Job identity
  - **time** `string` Cron rule
  - **bash** `string` Exec base
  - **start** `boolean` Begin execution
  - **zone** `string` Timezone

```json
{
	"identity":"test",
	"time":"* * * * * *",
	"bash":"echo 1",
	"start":true,
	"zone":"Asia/Shanghai"
}
```

- response
  - **error** `number` status
  - **msg** `string` Message

```json
{
    "error": 0,
    "msg": "ok"
}
```

#### Get Job

- url `/get`
- method `POST`
- body
  - **identity** `string` Job identity

```json
{
	"identity":"test"
}
```

- response
  - **error** `number` status
  - **data**
    - **identity** `string` Job identity
    - **time** `string` Cron rule
    - **bash** `string` Exec base
    - **start** `boolean` Begin execution
    - **zone** `string` Timezone
    - **running** `boolean` Running status
    - **nextDate** `Date` Next run date
    - **lastDate** `Date` Last run date

```json
{
    "error": 0,
    "data": {
        "identity": "test",
        "time": "* * * * * *",
        "bash": "echo 1",
        "start": true,
        "zone": "Asia/Shanghai",
        "running": true,
        "nextDate": "2019-09-26T09:35:59.000Z",
        "lastDate": "2019-09-26T09:35:58.002Z"
    }
}
```

#### Get All Identity

- url `/all`
- method `POST`
- body `none`
- response
  - **error** `number` status
  - **data** `array` identity array

```json
{
    "error": 0,
    "data": [
        "test"
    ]
}
```

#### Lists Job

- url `/lists`
- method `POST`
- body
  - **identity** `string[]` Jobs identity array

```json
{
	"identity":["test"]
}
```

- response
  - **data** `array`
    - **identity** `string` Job identity
    - **time** `string` Cron rule
    - **bash** `string` Exec base
    - **start** `boolean` Begin execution
    - **zone** `string` Timezone
    - **running** `boolean` Running status
    - **nextDate** `Date` Next run date
    - **lastDate** `Date` Last run date

```json
{
    "error": 0,
    "data": [
        {
            "identity": "test",
            "time": "* * * * * *",
            "bash": "echo 1",
            "start": true,
            "zone": "Asia/Shanghai",
            "running": true,
            "nextDate": "2019-09-26T09:40:04.000Z",
            "lastDate": "2019-09-26T09:40:03.000Z"
        }
    ]
}
```

#### Change Running Status

- url `/status`
- method `POST`
- body
  - **identity** `string` Job identity
  - **status** `boolean` Job running status

```json
{
	"identity":"test",
	"status":false
}
```

- response
  - **error** `number` status
  - **msg** `string` Message

```json
{
    "error": 0,
    "msg": "ok"
}
```

#### Delete Job

- url `/delete`
- method `POST`
- body
  - **identity** `string` Job identity

```json
{
	"identity":"test"
}
```

- response
  - **error** `number` status
  - **msg** `string` Message

```json
{
    "error": 0,
    "msg": "ok"
}
```

#### Search Logs

- url `/search`
- method `POST`
- body
  - **type** `string` Logging Type, All if not present
    - 'put', 'delete', 'status', 'run', 'error'
  - **identity** `string` Job identity
  - **time** `object`
    - **lt** `number` Match fields "less than" this one.
    - **gt** `number` Match fields "greater than" this one.
    - **lte** `number` Match fields "less than or equal to" this one.
    - **gte** `number` Match fields "greater than or equal to" this one.
    - **eq** `number` Match fields equal to this one.
    - **ne** `number` Match fields not equal to this one.
  - **limit** `number` Page limit
  - **skip** `number` Page Number

Get Range Logs

```json
{
	"identity": "test",
	"time": {
      "lt":1570701566010,
      "gt":1570701564010
	},
	"limit": 10,
	"skip": 0
}
```

Put `_source`

```json
{
  "type": "put",
  "identity": "test",
  "body": {
    "identity":"test",
    "time":"* * * * * *",
    "bash":"echo 1",
    "start":true,
    "zone":"Asia/Shanghai"
  },
  "status": true,
  "time": 1571024492489,
}
```

Delete `_source`

```json
{
  "type": "delete",
  "identity": "test",
  "body": {
    "identity":"test",
  },
  "status": true,
  "time": 1571024493232,
}
```

Status `_source`

```json
{
  "type": "status",
  "identity": "test",
  "body": {
    "identity":"test",
    "status":false
  },
  "time": 1571024493282,
}
```

Run `_source`

```json
{
  "type": "run",
  "identity": "test",
  "result": "1\n",
  "time": 1571018416012,
}
```

Error `_source`

```json
{
  "type": "error",
  "identity": "test",
  "result": "errors message.....",
  "time": 1571018416012,
}
```