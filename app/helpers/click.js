const config = require('config');
const {ClickHouse} = require('clickhouse');

const clickhouse = new ClickHouse(config.clickhouse);

module.exports = async function click(queries) {
    for (const query of queries) {
        try {
            return await clickhouse.query(query).toPromise();
        } catch (e) {
            console.log(e);
        }
    }
};