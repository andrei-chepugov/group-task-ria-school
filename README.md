node-koajs-rest v3.5.3
======================

A simple [Koajs 2.7.0 Application REST](https://github.com/andrei-chepugov/ria-clickhouse)
This version based on [koa 2.7.0](https://github.com/koajs/koa).


Quick start
===========

**Checkout node-koajs-rest:**

```sh
$ git clone https://github.com/andrei-chepugov/ria-clickhouse
```

**Install modules:**

```sh
$ npm install
```

**Start app:**

```sh
$ npm run start
```

ClickHouse
==========

What Is ClickHouse?

ClickHouse® is a column-oriented database management system (DBMS) for online analytical processing of queries (OLAP).

You can also read the [documentation](https://clickhouse.tech/docs/en/)


Docker
======

**Build docker:**

```sh
$ sudo docker build -t koajs . 
```

**Run container:**

```sh
$ sudo docker run -d -p 8081:8081 --name koajs koajs
```

Unit testing REST service:
================

**Run test:**

```sh
$ npm run test
```

Manual testing REST service:
============================

You can also manual check the serviceability of service with bash and [curl](https://curl.haxx.se/)

###### Get all names databases from memory

```sh
$ curl -XGET "http://localhost:8081/databases"
```

###### Get all names tables from DB

```sh
$ curl -XGET "http://localhost:8081/databases/slon/tables"
```

###### Get all names fields from table

```sh
$ curl -XGET "http://localhost:8081/databases/slon/tables/facts/fields"
```

###### Get all fields from table

```sh
$ curl -XGET "http://localhost:8081/reports"
```

###### Get fields from table && Save all reports in DB

```sh
$ curl -XPOST "http://localhost:8081/report" -H 'Content-Type: application/json' -d '{...}'
```
