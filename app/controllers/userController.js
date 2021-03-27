const mariaDB = require('../managers/mariaDBManager');

const PERIOD = 3 * 60 * 60 * 1000;
const minusPERIOD = -1;


/**
 * @example curl -XGET "http://localhost:8081/user"
 */
async function getUserByToken(ctx, next) {
    const token = ctx.cookies.get('token')
    if (token) {
        const user = await mariaDB.getUserByTokenFromDB(token);
        if (user) {
            ctx.cookies.set('token', user.token, {httpOnly: true, path: '/', expires: new Date(PERIOD + Date.now())});
            ctx.body = user;
        } else {
            ctx.status = 401;
        }
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.getUserByToken = getUserByToken;


/**
 * @example curl -XGET "http://localhost:8081/logout"
 */
async function getLogoutUserByToken(ctx, next) {
    const token = ctx.cookies.get('token')
    if (token) {
        const user = await mariaDB.getUserByTokenFromDB(token);
        if (user) {
            ctx.cookies.set('token', user.token, {
                httpOnly: true,
                path: '/',
                expires: new Date(minusPERIOD + Date.now())
            });
            ctx.body = user;
        } else {
            ctx.status = 401;
        }
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.getLogoutUserByToken = getLogoutUserByToken;


/**
 * @example curl -XPOST "http://localhost:8081/sign-in" -H 'Content-Type: application/json' -d '{...}'
 */
async function createUser(ctx, next) {
    const user = await mariaDB.createUserInDB(ctx.request.body);
    if (user) {
        ctx.cookies.set('token', user.token, {httpOnly: true, path: '/', expires: new Date(PERIOD + Date.now())});
        ctx.body = user;
        ctx.status = 201;
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.createUser = createUser;


/**
 * @example curl -XPOST "http://localhost:8081/login" -H 'Content-Type: application/json' -d '{...}'
 */
async function getLoginUser(ctx, next) {
    const user = await mariaDB.getLoginUserFromDB(ctx.request.body);
    if (user) {
        ctx.cookies.set('token', user.token, {httpOnly: true, path: '/', expires: new Date(PERIOD + Date.now())});
        ctx.body = user;
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.getLoginUser = getLoginUser;