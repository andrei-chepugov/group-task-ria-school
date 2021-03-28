const clickhouseDB = require('../managers/clickhouseDBManager');
const mariaDB = require('../managers/mariaDBManager');


async function importAllTables(ctx, next) {
    const token = ctx.cookies.get('token');
    const user = await mariaDB.getUserByTokenFromDB(token);
    if (user && user.isAdmin) {
        const tables = await clickhouseDB.getAllTables()
        const result = await mariaDB.importTablesFromClickhouseIntoDB(tables)
        ctx.body = result;
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.importAllTables = importAllTables;


/**
 * @example curl -XGET "http://localhost:8081/admin/databases"
 */
async function getDatabasesList(ctx, next) {
    const token = ctx.cookies.get('token');
    const user = await mariaDB.getUserByTokenFromDB(token);
    if (user && user.isAdmin) {
        const names = await clickhouseDB.getDatabasesListFromDB();
        if (Array.isArray(names) && names.length) {
            ctx.body = names;
            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.getDatabasesList = getDatabasesList;


/**
 * @example curl -XGET "http://localhost:8081/admin/databases/slon/tables"
 */
async function getDatabaseTables(ctx, next) {
    const token = ctx.cookies.get('token');
    const user = await mariaDB.getUserByTokenFromDB(token);
    if (user && user.isAdmin) {
        const db = String(ctx.params.name);
        const names = await clickhouseDB.getDatabaseTablesFromDB(db);
        if (Array.isArray(names) && names.length) {
            ctx.body = names;
            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
    } else {
        ctx.status = 401;
    }
    await next();
}

exports.getDatabaseTable = getDatabaseTables;