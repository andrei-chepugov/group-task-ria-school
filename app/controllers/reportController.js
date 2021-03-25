const clickhouseDB = require('../managers/clickhouseDBManager');


/**
 * @example curl -XGET "http://localhost:8081/reports"
 */
async function getReportsList(ctx, next) {
    const reports = await clickhouseDB.getReportsfromDB();
    if (Array.isArray(reports) && reports.length) {
        ctx.body = reports;
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

exports.getReportsList = getReportsList;


/**
 * @example curl -XPOST "http://localhost:8081/report" -H 'Content-Type: application/json' -d '{...}'
 */
async function createReport(ctx, next) {
    ctx.body = await clickhouseDB.createReportToDB(ctx.request.body);
    clickhouseDB.saveHistoryReportsToDB(ctx.request.body)
        .catch((e) => {
            console.log(e);
        })
    await next();
}

exports.createReport = createReport;