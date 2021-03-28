const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    adminController = require('../controllers/adminController'),
    schemaAdminController = require('../controllers/schemaAdminController'),
    userController = require('../controllers/userController'),
    schemaController = require('../controllers/schemaController'),
    reportController = require('../controllers/reportController')

const router = new Router();

router
    // for admin user management
    .get('/admin/users', adminController.getUsersByToken)
    .get('/admin/delete/:id', adminController.deleteUser)
    .get('/admin/user/:id/granted', adminController.getUserGrantedTables)
    .put('/admin/update-user', KoaBody(), adminController.updateUser)
    // for admin database management
    .get('/admin/databases', schemaAdminController.getDatabasesList)
    .get('/admin/databases/:name/tables', schemaAdminController.getDatabaseTable)
    // "_comment": "Admin update user permissions",
    // .put('/admin/', schemaAdminController.setAccessRightsUserForTable) // for admin, in progress...
    // .put('/admin/access-rights', schemaAdminController.setAccessRightsUserForTable) // for admin, in progress...

    // for user himself management
    .get('/user', userController.getUserByToken)
    .get('/logout', userController.getLogoutUserByToken)
    .post('/sign-in', KoaBody(), userController.createUser)
    .post('/login', KoaBody(), userController.getLoginUser)
    // for user database management
    .get('/databases', schemaController.getDatabasesList)
    .get('/databases/:name/tables', schemaController.getDatabaseTable)
    .get('/databases/:name/tables/:tableName/fields', schemaController.getTableFields)
    .post('/report', KoaBody(), reportController.createReport) // for user, in progress...
    .get('/reports', reportController.getReportsList) // for admin & user
    .put('/reports/transfer', KoaBody(), reportController.setReportsList);



module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
};