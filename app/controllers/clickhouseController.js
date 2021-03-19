const myDB = require('../managers/clickhouseDBManager');


/**
 * @example curl -XGET "http://localhost:8081/databases"
 */
async function getDatabasesList(ctx, next) {
    const names = await myDB.getDatabasesListFromDB();
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
 * @example curl -XGET "http://localhost:8081/databases/slon/tables"
 */
async function getDatabaseTables(ctx, next) {
    const db = String(ctx.params.name);
    const names = await myDB.getDatabaseTablesFromDB(db);
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
    const names = await myDB.getTableFieldsFromDB(db, table);
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


/**
 * @example curl -XPOST "http://localhost:8081/report/" -H 'Content-Type: application/json' -d '{...}'
 */
async function createReport(ctx, next) {
    ctx.body = await myDB.createReportToDB(ctx.request.body);
    await next();
}

exports.createReport = createReport;