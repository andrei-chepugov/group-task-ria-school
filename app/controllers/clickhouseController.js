const myDB = require('../managers/clickhouseDBManager');

/**
 * @example curl -XGET "http://localhost:8081/databases"
 */
async function getDatabasesList(ctx, next) {
    const names = await myDB.getDatabasesFromDB()
    if (names.length !== 0) {
        ctx.body = [names];
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getDatabasesList = getDatabasesList;


/**
 * @example curl -XGET "http://localhost:8081/databases/:name/tables"
 */
async function getDatabaseTables(ctx, next) {
    const db = String(ctx.params.name);
    const names = await myDB.getDatabaseTablesFromDB(db)
    if (names.length !== 0) {
        ctx.body = [names];
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getDatabaseTable = getDatabaseTables;


/**
 * @example curl -XGET "http://localhost:8081/databases/:name/tables/:tableName/fields"
 */
async function getTableFields(ctx, next) {
    const db = String(ctx.params.name);
    const table = String(ctx.params.tableName);
    const names = await myDB.getTableFieldsfronDB(db, table)
    if (names.length !== 0) {
        ctx.body = [names];
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getTableFields = getTableFields;

function createReport() {
    //
}

exports.createReport = createReport;