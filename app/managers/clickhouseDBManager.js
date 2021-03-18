const fs = require('fs');
const config = require('config');
const {ClickHouse} = require('clickhouse');
const click = require('../helpers/click');

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
    const queries = ["SELECT name FROM system.databases WHERE name != 'system'"];
    return await click(queries);
}

exports.getDatabasesListFromDB = getDatabasesListFromDB;

/**
 * Get all tables from memory DB
 * @param db
 * @return {Promise}
 */
async function getDatabaseTablesFromDB(db) {
    const queries = ["SELECT name FROM system.tables WHERE database = '" + db + "'"];
    return await click(queries);
}

exports.getDatabaseTablesFromDB = getDatabaseTablesFromDB;

/**
 * Get all fields from table
 * @param db
 * @param table
 * @return {Promise}
 */
async function getTableFieldsfromDB(db, table) {
    const queries = ["SELECT name, type FROM system.columns WHERE database = '" + db + "' AND table = '" + table + "'"]
    return await click(queries);
}

exports.getTableFieldsfromDB = getTableFieldsfromDB;