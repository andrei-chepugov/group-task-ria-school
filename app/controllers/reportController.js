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
 * @example curl -XPOST "http://localhost:8081/report" -H 'Content-Type: application/json' -d '{...}'
 */
async function createReport(ctx, next) {
    function checkTables(source, tableList) {
        // tableList.find();
    }

    const token = ctx.cookies.get('token');
    const tableList = await mariaDBManager.getTablesDatabaseByToken(token);
    const isChecked = checkTables(ctx.request.body.source, tableList);
    if (isChecked) {
        ctx.body = await clickhouseDB.createReportToDB(ctx.request.body);
        clickhouseDB.saveHistoryReportsToDB(ctx.request.body)
            .catch((e) => {
                console.log(e);
            })
    } else {
        ctx.status = 403;
    }
    await next();
}

exports.createReport = createReport;