const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    {getId, list, createItem, updateItem, removeItem} = require('../controllers/indexController'),
    clickhouse = require('../controllers/clickhouseController')


const router = new Router();

router
    .get('/databases', clickhouse.getDatabasesList)
    .get('/databases/:name/tables', clickhouse.getDatabaseTable)
    .get('/databases/:name/tables/:tableName/fields', clickhouse.getTableFields)
    .post('/report/', KoaBody(), clickhouse.createReport);

module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
};