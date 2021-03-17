const myDb = require('../managers/clickhouseDBManager');

function getDatabasesList(ctx, next) {
    ctx.body = ['slon', 'mviews'];
}

exports.getDatabasesList = getDatabasesList;

function getDatabaseTables(ctx, next) {
    ctx.body = ['facts', 'r_tags_v2'];
}

exports.getDatabaseTable = getDatabaseTables;

function getTableFields(ctx, next) {
    ctx.body = [
        {name: `EventDate`, type: 'Date'},
        {name: `HourDate`, type: 'Number'},
        {name: `MinuteDate`, type: 'Number'},
        {name: `SecondDate`, type: 'Number'},
        {name: `web_id`, type: 'Number'},
        {name: `user_id`, type: 'Number'},
        {name: `project_id`, type: 'Number'},
        {name: `r_audience`, type: 'String'},
        {name: `r_source`, type: 'String'},
        {name: `r_medium`, type: 'String'},
        {name: `r_campaign`, type: 'String'},
        {name: `event_id`, type: '[Number]'}
    ]
}

exports.getTableFields = getTableFields;

function createReport() {
    //
}

exports.createReport = createReport;