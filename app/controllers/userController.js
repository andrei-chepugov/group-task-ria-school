const mariaDB = require('../managers/mariaDBManager');

const PERIOD = 3 * 60 * 60 * 1000;

/**
 * @example curl -XPOST "http://localhost:8081/login" -H 'Content-Type: application/json' -d '{...}'
 */
async function getLoginUser(ctx, next) {
    const user = await mariaDB.getLoginUserFromDB(ctx.request.body);
    if (user) {
        ctx.body = user;
        ctx.cookies.set('token', user.token, {httpOnly: true, path: '/', expires: new Date(PERIOD + Date.now())});
        ctx.status = 204;
    } else {
        ctx.body = 'Unauthorized';
        ctx.status = 401;
    }
    await next();
}

exports.getLoginUser = getLoginUser;


/**
 * @example curl -XPOST "http://localhost:8081/sign-in" -H 'Content-Type: application/json' -d '{...}'
 */
async function createUser(ctx, next) {
    const user = await mariaDB.createUserInDB(ctx.request.body);
    if (user) {
        ctx.body = user;
        ctx.status = 201;
    } else {
        ctx.body = 'Unauthorized';
        ctx.status = 401;
    }
    await next();
}

exports.createUser = createUser;