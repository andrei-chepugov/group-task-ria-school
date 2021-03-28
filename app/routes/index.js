const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    adminController = require('../controllers/adminController'),
    schemaAdminController = require('../controllers/schemaAdminController'),
    userController = require('../controllers/userController'),
    schemaController = require('../controllers/schemaController'),
    reportController = require('../controllers/reportController')

const router = new Router();

router
    // for user database management
    .get('/databases', schemaController.getDatabasesList)
    .get('/databases/:name/tables', schemaController.getDatabaseTable)
    .get('/databases/:name/tables/:tableName/fields', schemaController.getTableFields)
    .post('/report', KoaBody(), reportController.createReport) // for user, in progress...
    .get('/reports', reportController.getReportsList) // for admin & user
    .put('/reports/transfer', KoaBody(), reportController.transferReport)
    // for user himself management
    .get('/user', userController.getUserByToken)
    .post('/login', KoaBody(), userController.getLoginUser)
    .get('/logout', userController.getLogoutUserByToken)
    .post('/sign-in', KoaBody(), userController.createUser)
    // for admin user management
    .get('/admin/users', adminController.getUsersByToken)
    .delete('/admin/user/:id', adminController.deleteUser)
    .get('/admin/user/:id/granted', adminController.getUserGrantedTables)
    .post('/admin/user/grants/add', KoaBody(), adminController.updateUserGrantedTables)
    .post('/admin/user/grants/delete', KoaBody(), adminController.deleteUserGrantedTables)
    .put('/admin/user/update', KoaBody(), adminController.updateUser)
    // for admin database management
    .get('/admin/databases', schemaAdminController.getDatabasesList)
    .get('/admin/databases/import', schemaAdminController.importAllTables)
    .get('/admin/databases/export', schemaAdminController.exportAllTables)
    .get('/admin/databases/:name/tables', schemaAdminController.getDatabaseTable)
    .get('/admin/databases/:name/tables/:tableName/fields', schemaController.getTableFields)
;

module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
};