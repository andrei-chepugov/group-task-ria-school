const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    adminController = require('../controllers/adminController'),
    schemaAdminController = require('../controllers/schemaAdminController'),
    userController = require('../controllers/userController'),
    schemaController = require('../controllers/schemaController'),
    reportController = require('../controllers/reportController')

const router = new Router();

router
    // for admin
    .get('/admin/users', adminController.getUsersByToken)
    .get('/admin/delete/:id', adminController.deleteUser)
    .get('/admin/databases', schemaAdminController.getDatabasesList)
    .get('/admin/databases/:name/tables', schemaAdminController.getDatabaseTable)
    .put('/admin/update-user', KoaBody(), adminController.updateUser)
    // .get('/admin/user/:id/granted', )
    // .put('/admin/', schemaAdminController.setAccessRightsUserForTable) // for admin, in progress...
    // .put('/admin/access-rights', schemaAdminController.setAccessRightsUserForTable) // for admin, in progress...
    // for user schema
    .get('/user', userController.getUserByToken)
    .get('/logout', KoaBody(), userController.getLogoutUserByToken)
    .post('/sign-in', KoaBody(), userController.createUser)
    .post('/login', KoaBody(), userController.getLoginUser)
    // for user
    .get('/databases', schemaController.getDatabasesList)
    .get('/databases/:name/tables', schemaController.getDatabaseTable)
    .get('/databases/:name/tables/:tableName/fields', schemaController.getTableFields)
    .get('/reports', reportController.getReportsList) // for admin & user (true/false)
    .post('/report', KoaBody(), reportController.createReport) // for user, in progress...
    // "_comment": "User template share",
    // "_comment": "Admin update user permissions",

module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
};