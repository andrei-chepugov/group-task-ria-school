const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    schemaController = require('../controllers/schemaController'),
    userController = require('../controllers/userController'),
    reportController = require('../controllers/reportController')

const router = new Router();

router
    .get('/admin/databases', schemaController.getDatabasesList)
    .get('/databases', schemaController.getDatabasesListForUser)
    .get('/admin/databases/:name/tables', schemaController.getDatabaseTable)
    .get('/databases/:name/tables', schemaController.getDatabaseTable) // in progress...
    .get('/databases/:name/tables/:tableName/fields', schemaController.getTableFields)
    .get('/reports', reportController.getReportsList)
    .post('/report', KoaBody(), reportController.createReport)
    .post('/login', KoaBody(), userController.getLoginUser) // Set-Cookie
    .post('/sign-in', KoaBody(), userController.createUser);

module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
};