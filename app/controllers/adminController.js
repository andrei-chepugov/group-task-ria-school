const mariaDB = require('../managers/mariaDBManager');


/**
 * @example curl -XGET "http://localhost:8081/admin/delete/5"
 */
async function deleteUser(ctx, next) {
    const token = ctx.cookies.get('token');
    const isChecked = await mariaDBManager.getUserByTokenFromDB(token);
    if (isChecked) {
        const deleted = await mariaDB.deleteUserInDB(ctx.params.id);
        if (deleted) {
            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.deleteUser = deleteUser;


/**
 * @example curl -XPOST "http://localhost:8081/admin/update" -H 'Content-Type: application/json' -d '{...}'
 */
async function updateUser(ctx, next) {
    const token = ctx.cookies.get('token');
    const isChecked = await mariaDBManager.getUserByTokenFromDB(token);
    if (isChecked) {
        const deleted = await mariaDB.updateUserInDB(ctx.params.id);
        if (deleted) {
            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.updateUser = updateUser;