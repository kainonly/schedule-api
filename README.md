# Schedule api

a scheduled dispatch management service

[![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/kainonly/schedule-api?style=flat-square)](https://github.com/kainonly/schedule-api)
[![Travis](https://img.shields.io/travis/kainonly/schedule-api?style=flat-square)](https://www.travis-ci.org/kainonly/schedule-api)
[![Docker Pulls](https://img.shields.io/docker/pulls/kainonly/schedule-api.svg?style=flat-square)](https://hub.docker.com/r/kainonly/schedule-api)
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
    volumes: 
      - ./schedule/data:/app/data
      - ./schedule/config.ini:/app/config.ini
    ports:
      - 3000:3000
```

Set `config.ini`

```ini
[elasticsearch]
# default storage index
default_index = schedule-service

# cluster set
# hosts = http://localhost:9200,http://localhost:9201
hosts = localhost:9200

# HTTP Basic Authentication
# username =
# password =

# Endpoint for the Elastic Service
# cloud_id =

# Base64-encoded token for authorization
# api_key =
```

## Api docs

Assume that the underlying request path is `http://localhost:3000`

#### Put Task

Update or create a task to automatically request execution services

- url `/put`
- method `POST`
- body
  - **identity** `string` Task identity
  - **time_zone** `string` [Timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
  - **start** `boolean` Begin execution
  - **entries** `object` workflow, object key stands for entry identity
    - **cron_time** `string` CronTab Rule, More seconds than regular
    - **url** `string` URL to send POST request
    - **headers** `object` Request headers, Can be empty
    - **body** `object` Request body, Can be empty

> You might find something like [crontab.guru](https://crontab.guru/) helpful

```json
{
  "identity":"test",
  "time_zone":"Asia/Shanghai",
  "start":true,
  "entries":{
    "subscription":{
      "cron_time":"*/10 * * * * *",
      "url":"https://api.developer.com/subscription"
    },
    "index":{
      "cron_time":"*/5 * * * * *",
      "url":"https://api.developer.com"
    }
  }
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

#### Get Task

Get a job information for the task identity

- url `/get`
- method `POST`
- body
  - **identity** `string` Task identity

```json
{
  "identity":"test"
}
```

- response
  - **error** `number` status
  - **data**
    - **identity** `string` Task identity
    - **start** `boolean` Begin execution
    - **time_zone** `string` [Timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
    - **entries** `object` workflow, object key stands for entry identity
      - **cron_time** `string` CronTab Rule, More seconds than regular
      - **url** `string` URL to send POST request
      - **headers** `object` Request headers, Can be empty
      - **body** `object` Request body, Can be empty
      - **next_date** `Date` Next run date
      - **last_date** `Date` Last run date

```json
{
  "error": 0,
  "data": {
    "identity": "test",
    "time_zone": "Asia/Shanghai",
    "start": true,
    "entries": {
      "subscription": {
        "cron_time": "*/10 * * * * *",
        "url": "https://api.developer.com/subscription",
        "headers": null,
        "body": null,
        "next_date": "2019-11-27T16:58:30+08:00",
        "last_date": "2019-11-27T16:58:20+08:00"
      },
      "index": {
        "cron_time": "*/5 * * * * *",
        "url": "https://api.developer.com",
        "headers": null,
        "body": null,
        "next_date": "2019-11-27T16:58:25+08:00",
        "last_date": "2019-11-27T16:58:20+08:00"
      }
    }
  }
}
```

#### All Tasks Identity

Get the identity of all tasks

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

#### Lists Tasks

Get a list of job information for the task identity

- url `/lists`
- method `POST`
- body
  - **identity** `string[]` Tasks identity array

```json
{
  "identity":["test"]
}
```

- response
  - **data** `array`
    - **identity** `string` Task identity
    - **start** `boolean` Begin execution
    - **time_zone** `string` [Timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
    - **entries** `object` workflow, object key stands for entry identity
      - **cron_time** `string` CronTab Rule, More seconds than regular
      - **url** `string` URL to send POST request
      - **headers** `object` Request headers, Can be empty
      - **body** `object` Request body, Can be empty
      - **next_date** `Date` Next run date
      - **last_date** `Date` Last run date

```json
{
  "error": 0,
  "data": [
    {
      "identity": "test",
      "time_zone": "Asia/Shanghai",
      "start": true,
      "entries": {
        "subscription": {
          "cron_time": "*/10 * * * * *",
          "url": "https://api.developer.com/subscription",
          "headers": null,
          "body": null,
          "next_date": "2019-11-27T17:32:40+08:00",
          "last_date": "2019-11-27T17:32:30+08:00"
        },
        "index": {
          "cron_time": "*/5 * * * * *",
          "url": "https://api.developer.com",
          "headers": null,
          "body": null,
          "next_date": "2019-11-27T17:32:35+08:00",
          "last_date": "2019-11-27T17:32:30+08:00"
        }
      }
    }
  ]
}
```

#### Change Running Status

Change the job running status of the task

- url `/running`
- method `POST`
- body
  - **identity** `string` Task identity
  - **running** `boolean` Running status

```json
{
  "identity":"test",
  "running":true
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

#### Delete Task

Stop and delete the task

- url `/delete`
- method `POST`
- body
  - **identity** `string` Task identity

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

Query the log related to the acquisition task

- url `/search`
- method `POST`
- body
  - **type** `string` Logging Type, All if not present
    - 'put', 'delete', 'running', 'success', 'error'
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
    "lt":1571295272000,
    "gt":1571295271000
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
    "identity": "test",
    "cron_time": "* */5 * * * *",
    "url": "https://api.developer.com/subscription",
    "time_zone": "Asia/Shanghai",
    "start": true
  },
  "action": true,
  "time": 1571295271483
}
```

Delete `_source`

```json
{
  "type": "delete",
  "identity": "test",
  "body": {
    "identity": "test"
  },
  "action": true,
  "time": 1571299147117
}
```

Running `_source`

```json
{
  "type": "running",
  "identity": "test",
  "body": {
    "identity": "test",
    "running": false
  },
  "time": 1571295299629
}
```

Success `_source`

```json
{
  "type": "success",
  "identity": "test",
  "url": "https://api.developer.com/subscription",
  "headers": {
    "server": "Tengine",
    "content-type": "application/json; charset=utf-8",
    "transfer-encoding": "chunked",
    "connection": "close",
    "strict-transport-security": "max-age=5184000",
    "date": "Thu, 17 Oct 2019 07:05:59 GMT",
    "vary": "Accept-Encoding",
    "x-frame-options": "SAMEORIGIN",
    "x-xss-protection": "1; mode=block",
    "x-content-type-options": "nosniff",
    "content-encoding": "gzip",
    "via": "cache2.l2cn1800[29,0], kunlun2.cn2466[52,0]",
    "timing-allow-origin": "*",
    "eagleid": "7ce1a71615712959590353713e"
  },
  "body": {
    "status": 1
  },
  "time": 1571295959073
}
```

Error `_source`

```json
{
  "type": "error",
  "identity": "test",
  "message": "Response code 404 (Not Found)",
  "time": 1571298950112
}
```

#### Clear Logs

Clear all logs for a task

- url `/clear`
- method `POST`
- body
  - **identity** `string` Task identity

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