const fs = require('fs');
const config = require('config');
const {ClickHouse} = require('clickhouse');
const clickhouse = new ClickHouse(config.clickhouse);
const initDB = fs.readFileSync('./app/managers/queries/initDB.sql');

clickhouse.query(initDB);

const queries = [
    'DROP TABLE IF EXISTS session_temp',

    `CREATE TABLE session_temp
     (
         date    Date,
         time    DateTime,
         mark    String,
         ips     Array(UInt32),
         queries Nested ( act String,
             id UInt32
             )
     ) ENGINE=MergeTree(date, (mark, time), 8192)`
];

async function click() {
    for (const query of queries) {
        try {
            const r = await clickhouse.query(query).toPromise();
            console.log(query, r);
        } catch (e) {
            console.log(e);
        }
    }
}

click();