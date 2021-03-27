const mariaDB = require('../managers/mariaDBManager');


/**
 * @example curl -XGET "http://localhost:8081/admin/users"
 */
async function getUsersByToken(ctx, next) {
    const token = ctx.cookies.get('token');
    const user = await mariaDB.getUserByTokenFromDB(token);
    if (user && user.isAdmin) {
        const users = await mariaDB.getUsersByTokenFromDB();
        if (users) {
            ctx.body = users;
        } else {
            ctx.status = 401;
        }
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.getUsersByToken = getUsersByToken;


/**
 * @example curl -XGET "http://localhost:8081/admin/delete/5"
 */
async function deleteUser(ctx, next) {
    const token = ctx.cookies.get('token');
    const user = await mariaDB.getUserByTokenFromDB(token);
    if (user && user.isAdmin) {
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
 * @example curl -XPOST "http://localhost:8081/admin/update/5" -H 'Content-Type: application/json' -d '{...}'
 */
async function updateUser(ctx, next) {
    const token = ctx.cookies.get('token');
    const user = await mariaDB.getUserByTokenFromDB(token);
    if (user && user.isAdmin) {
        const updated = await mariaDB.updateUserInDB(ctx.request.body);
        if (updated) {
            ctx.body = updated;
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