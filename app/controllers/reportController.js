const clickhouseDB = require('../managers/clickhouseDBManager');
const mariaDB = require('../managers/mariaDBManager');


/**
 * @example curl -XGET "http://localhost:8081/reports"
 */
async function getReportsList(ctx, next) {
    const token = ctx.cookies.get('token');
    const user = await mariaDB.getUserByTokenFromDB(token);
    const reports = await clickhouseDB.getReportsfromDB(user);
    if (Array.isArray(reports) && reports.length) {
        ctx.body = reports;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
    await next();
}

exports.getReportsList = getReportsList;


/**
 * @example curl -XPUT "http://localhost:8081/reports/transfer" -H 'Content-Type: application/json' -d '{...}'
 */
async function transferReport(ctx, next) {
    const token = ctx.cookies.get('token');
    const userSource = await mariaDB.getUserByTokenFromDB(token);
    if (!userSource) {
        return ctx.status = 401;
    }
    const report = await clickhouseDB.getReportById(ctx.request.body.id).catch(() => null);
    if (!report) {
        return ctx.status = 404;
    }
    if (Number(report.id_user) !== userSource.id) {
        return ctx.status = 403;
    }
    const userTarget = await mariaDB.getUserByEmailFromDB(ctx.request.body.email);
    if (!userTarget) {
        return ctx.status = 400;
    }
    const reports = await clickhouseDB.transferReportsToDB(ctx.request.body, userTarget);
    ctx.body = reports;
    await next();
}

exports.transferReport = transferReport;


/**
 * @example curl -XPOST "http://localhost:8081/report" -H 'Content-Type: application/json' -d '{...}'
 */
async function createReport(ctx, next) {
    function checkTables(source, tableList) {
        // tableList.find();
    }

    const token = ctx.cookies.get('token');
    const tableList = await mariaDB.getTablesDatabaseByToken(token);
    const isChecked = checkTables(ctx.request.body.source, tableList);
    if (isChecked) {
        ctx.body = await clickhouseDB.createReportToDB(ctx.request.body);
        const user = await mariaDB.getUserByTokenFromDB(token);
        clickhouseDB.saveHistoryReportsToDB(ctx.request.body, user)
            .catch((e) => {
                console.log(e);
            })
    } else {
        ctx.status = 403;
    }
    await next();
}

exports.createReport = createReport;