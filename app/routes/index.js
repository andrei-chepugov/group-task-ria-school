const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    adminController = require('../controllers/adminController'),
    schemaAdminController = require('../controllers/schemaAdminController'),
    userController = require('../controllers/userController'),
    schemaController = require('../controllers/schemaController'),
    reportController = require('../controllers/reportController')

const router = new Router();

router
    .get('/admin/databases', schemaAdminController.getDatabasesList) // for admin
    .get('/admin/databases/:name/tables', schemaAdminController.getDatabaseTable) // for admin
    .get('/admin/access-rights/:user/:table', schemaAdminController.setAccessRightsUserForTable) // for admin, in progress...
    .get('/admin/delete/:id', adminController.deleteUser) // for admin
    .get('/user', userController.getUserByToken) // for user
    .get('/logout', KoaBody(), userController.getLogoutUserByToken) // Set-Cookie
    .get('/databases', schemaController.getDatabasesList) // for user
    .get('/databases/:name/tables', schemaController.getDatabaseTable) // for user
    .get('/databases/:name/tables/:tableName/fields', schemaController.getTableFields) // for user
    .get('/reports', reportController.getReportsList) // for admin & user
    .post('/admin/update', KoaBody(), adminController.updateUser) // for admin, in progress...
    .post('/sign-in', KoaBody(), userController.createUser) // Set-Cookie
    .post('/login', KoaBody(), userController.getLoginUser) // Set-Cookie
    .post('/report', KoaBody(), reportController.createReport); // for user

module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
};