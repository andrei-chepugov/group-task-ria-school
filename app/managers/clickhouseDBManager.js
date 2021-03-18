const fs = require('fs');
const config = require('config');
const {ClickHouse} = require('clickhouse');

const clickhouse = new ClickHouse(config.clickhouse);
const initDB = fs.readFileSync('./app/managers/queries/initDB.sql');

clickhouse.query(initDB);

/**
 * Get all names databases from memory
 * @return {Promise}
 */
async function getDatabasesListFromDB() {
    const queries = ["SELECT name FROM system.databases WHERE name != 'system'"];
    for (const query of queries) {
        try {
            return await clickhouse.query(query).toPromise();
        } catch (e) {
            console.log(e);
        }
    }
}

exports.getDatabasesListFromDB = getDatabasesListFromDB;

/**
 * Get all tables from memory DB
 * @param db
 * @return {Promise}
 */
async function getDatabaseTablesFromDB(db) {
    const queries = ["SELECT name FROM system.tables WHERE database = '" + db + "'"];
    for (const query of queries) {
        try {
            return await clickhouse.query(query).toPromise();
        } catch (e) {
            console.log(e);
        }
    }
}

exports.getDatabaseTablesFromDB = getDatabaseTablesFromDB;

/**
 * Get all fields from table
 * @param db
 * @param table
 * @return {Promise}
 */
async function getTableFieldsfronDB(db, table) {
    const queries = ["SELECT name, type FROM system.columns WHERE database = '" + db + "' AND table = '" + table + "'"]
    for (const query of queries) {
        try {
            return await clickhouse.query(query).toPromise();
        } catch (e) {
            console.log(e);
        }
    }
}

exports.getTableFieldsfronDB = getTableFieldsfronDB;


// async function click() {
//     for (const query of queries) {
//         try {
//             const r = await clickhouse.query(query).toPromise();
//             console.log(query, r);
//         } catch (e) {
//             console.log(e);
//         }
//     }
// }
//
// click();