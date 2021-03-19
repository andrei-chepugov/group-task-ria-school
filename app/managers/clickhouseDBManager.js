const fs = require('fs');
const config = require('config');
const {ClickHouse} = require('clickhouse');
const {buildQuery} = require('../helpers/buildQuery');

const clickhouse = new ClickHouse(config.clickhouse);
const initDB = fs.readFileSync('./app/managers/queries/initDB.sql');


/**
 * Initiate database
 */
clickhouse.query(initDB);

/**
 * Get all names databases from memory
 * @return {Promise}
 */
async function getDatabasesListFromDB() {
    const query = `SELECT name
                   FROM system.databases
                   WHERE name != 'system'`;
    return clickhouse.query(query).toPromise();
}

exports.getDatabasesListFromDB = getDatabasesListFromDB;

/**
 * Get all tables from memory DB
 * @param db
 * @return {Promise}
 */
async function getDatabaseTablesFromDB(db) {
    const query = `SELECT name FROM system.tables WHERE database = '${db}' `;
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
 * Get all fields from table
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

async function createReportToDB(params) {
    const query = buildQuery(params);
    return clickhouse.query(query).toPromise();
}

exports.createReportToDB = createReportToDB;