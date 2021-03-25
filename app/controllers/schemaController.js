const clickhouseDB = require('../managers/clickhouseDBManager');
const mariaDB = require('../managers/mariaDBManager');


/**
 * @example curl -XGET "http://localhost:8081/admin/databases"
 */
async function getDatabasesList(ctx, next) {
    const names = await clickhouseDB.getDatabasesListFromDB();
    if (Array.isArray(names) && names.length) {
        ctx.body = names;
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getDatabasesList = getDatabasesList;


/**
 * @example curl -XGET "http://localhost:8081/databases"
 */
async function getDatabasesListForUser(ctx, next) {
    const databaseNames = await mariaDB.f(ctx.cookies.get('token'));
    if (Array.isArray(databaseNames) && databaseNames.length) {
        ctx.body = databaseNames;
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getDatabasesListForUser = getDatabasesListForUser;


/**
 * @example curl -XGET "http://localhost:8081/databases/slon/tables"
 */
async function getDatabaseTables(ctx, next) {
    const db = String(ctx.params.name);
    const names = await clickhouseDB.getDatabaseTablesFromDB(db);
    if (Array.isArray(names) && names.length) {
        ctx.body = names;
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getDatabaseTable = getDatabaseTables;


/**
 * @example curl -XGET "http://localhost:8081/databases/slon/tables/facts/fields"
 */
async function getTableFields(ctx, next) {
    const db = String(ctx.params.name);
    const table = String(ctx.params.tableName);
    const names = await clickhouseDB.getTableFieldsFromDB(db, table);
    if (Array.isArray(names) && names.length) {
        ctx.body = names;
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getTableFields = getTableFields;