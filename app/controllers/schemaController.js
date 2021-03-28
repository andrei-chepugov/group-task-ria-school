const clickhouseDB = require('../managers/clickhouseDBManager');
const mariaDB = require('../managers/mariaDBManager');


/**
 * @example curl -XGET "http://localhost:8081/databases"
 */
async function getDatabasesList(ctx, next) {
    const databaseNames = await mariaDB.getDatabaseNamesByToken(ctx.cookies.get('token'));
    if (Array.isArray(databaseNames) && databaseNames.length) {
        ctx.body = databaseNames;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
    await next();
}

exports.getDatabasesList = getDatabasesList;


/**
 * @example curl -XGET "http://localhost:8081/databases/slon/tables"
 */
async function getDatabaseTables(ctx, next) {
    const tableNames = await mariaDB.getTableNameInDatabaseByToken(ctx.cookies.get('token'), ctx.params.name);
    if (Array.isArray(tableNames) && tableNames.length) {
        ctx.body = tableNames;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
    await next();
}

exports.getDatabaseTable = getDatabaseTables;


/**
 * user:
 * @example curl -XGET "http://localhost:8081/databases/slon/tables/facts/fields"
 *
 * admin:
 * @example curl -XGET "http://localhost:8081/admin/databases/slon/tables/facts/fields"
 */
async function getTableFields(ctx, next) {
    const db = String(ctx.params.name);
    const table = String(ctx.params.tableName);
    const names = await clickhouseDB.getTableFieldsFromDB(db, table);
    if (Array.isArray(names) && names.length) {
        ctx.body = names;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
    await next();
}

exports.getTableFields = getTableFields;