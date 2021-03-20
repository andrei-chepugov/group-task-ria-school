const fs = require('fs');
const config = require('config');
const {ClickHouse} = require('clickhouse');
const {buildQuery} = require('../helpers/buildQuery');

const clickhouse = new ClickHouse(config.clickhouse);

const initSlon = fs.readFileSync('./app/managers/queries/initDB/initSlon.sql', 'utf-8');
const initMviews = fs.readFileSync('./app/managers/queries/initDB/initMviews.sql', 'utf-8');
const initReports = fs.readFileSync('./app/managers/queries/initDB/initReports.sql', 'utf-8');
const initSlonFacts = fs.readFileSync('./app/managers/queries/initDB/initSlonFacts.sql', 'utf-8');
const initSlonR_tags_v2 = fs.readFileSync('./app/managers/queries/initDB/initSlonR_tags_v2.sql', 'utf-8');
const initMviewsCalltracking = fs.readFileSync('./app/managers/queries/initDB/initMviewsCalltracking.sql', 'utf-8');
const initReportsHistory = fs.readFileSync('./app/managers/queries/initDB/initReportsHistory.sql', 'utf-8');


/**
 * Initiate database
 */
(async function query() {
    await clickhouse.query(initSlon).toPromise();
    await clickhouse.query(initMviews).toPromise();
    await clickhouse.query(initReports).toPromise();
    await clickhouse.query(initSlonFacts).toPromise();
    await clickhouse.query(initSlonR_tags_v2).toPromise();
    await clickhouse.query(initMviewsCalltracking).toPromise();
    await clickhouse.query(initReportsHistory).toPromise();
})()

/**
 * Get all names databases from memory
 * @return {Promise}
 */
async function getDatabasesListFromDB() {
    const query = `SELECT name
                   FROM system.databases
                   WHERE name NOT IN ('system', 'default')`;
    return clickhouse.query(query).toPromise();
}

exports.getDatabasesListFromDB = getDatabasesListFromDB;

/**
 * Get all names tables from DB
 * @param db
 * @return {Promise}
 */
async function getDatabaseTablesFromDB(db) {
    const query = `SELECT name FROM system.tables WHERE database = '${db}'`;
    return clickhouse.query(query).toPromise();
}

exports.getDatabaseTablesFromDB = getDatabaseTablesFromDB;


const typeMapping = {
    "Date": "Date",
    "String": "String",
    "UInt8": "Number",
    "UInt16": "Number",
    "UInt32": "Number",
    "Array(UInt8)": "[Number]",
    "Array(UInt16)": "[Number]",
    "Array(UInt32)": "[Number]",
}

/**
 * Get all fields names from table
 * @param db
 * @param table
 * @return {Promise}
 */
async function getTableFieldsFromDB(db, table) {
    const query = `SELECT name, type FROM system.columns WHERE database = '${db}' AND table = '${table}'`;
    return clickhouse.query(query).toPromise().then((result) => {
        return result.map((element) => {
            return {name: element.name, type: typeMapping[element.type]};
        });
    });
}

exports.getTableFieldsFromDB = getTableFieldsFromDB;


/**
 * Get all fields from table
 * @return {Promise}
 */
async function getReportsfromDB() {
    const query = `SELECT *
                   FROM reports.history`;
    return clickhouse.query(query).toPromise();
}

exports.getReportsfromDB = getReportsfromDB;


/**
 * Save all reports in DB
 * @return {Promise}
 */
async function saveHistoryReportsToDB(params) {
    const query = `INSERT INTO reports.history (request) VALUES ('${JSON.stringify(params)}')`;
    return clickhouse.query(query).toPromise();
}

exports.saveHistoryReportsToDB = saveHistoryReportsToDB;

/**
 * Get fields from table
 * @param params
 * @return {Promise}
 */
async function createReportToDB(params) {
    const query = buildQuery(params);
    return clickhouse.query(query).toPromise();
}

exports.createReportToDB = createReportToDB;