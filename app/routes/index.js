const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    clickhouse = require('../controllers/clickhouseController')

const router = new Router();

router
    .get('/databases', clickhouse.getDatabasesList)
    .get('/databases/:name/tables', clickhouse.getDatabaseTable)
    .get('/databases/:name/tables/:tableName/fields', clickhouse.getTableFields)
    .get('/reports', clickhouse.getReportsList)
    .post('/report', KoaBody(), clickhouse.createReport);

module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
};