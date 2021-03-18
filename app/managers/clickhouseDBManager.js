const fs = require('fs');
const config = require('config');
const {ClickHouse} = require('clickhouse');

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
    const query = "SELECT name FROM system.databases WHERE name != 'system'";
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

/**
 * Get all fields from table
 * @param db
 * @param table
 * @return {Promise}
 */
async function getTableFieldsFromDB(db, table) {
    const query = `SELECT name, type FROM system.columns WHERE database = '${db}' AND table = '${table}'`;
    return clickhouse.query(query).toPromise();
}

exports.getTableFieldsFromDB = getTableFieldsFromDB;