const config = require('config');
const conf = `redis://${config.redis.host}:${config.redis.port}`;
const redis = require("redis");
const client = redis.createClient(conf);

const {promisify} = require("util");
const getAsync = promisify(client.get).bind(client);
const getAllKeysAsync = promisify(client.keys).bind(client);
const getAllValueAsync = promisify(client.mget).bind(client);
const setAsync = promisify(client.set).bind(client);
const updateAsync = promisify(client.set).bind(client);
const removeAsync = promisify(client.del).bind(client);

module.exports = {

    /**
     * Get all records from memory DB
     * @return {Promise}
     */
    getAll: async function getAllFromDb() {
        const keys = await getAllKeysAsync("*");
        if (keys.length) {
            const values = await getAllValueAsync(keys);
            return keys.map((key, index) => ({name: values[index], id: Number(key)}));
        } else {
            return [];
        }
    },

    /**
     * Get record by id from memory DB
     * @param id
     * @return {Promise}
     */
    getById: function getIdFromDb(id) {
        return getAsync(id);
    },

    /**
     * Add new record to memory DB
     * @param id
     * @param name
     * @return {Promise}
     */
    setNewId: function setNewIdToDb(id, name) {
        return setAsync(id, name);
    },

    /**
     * Update record into memory DB
     * @param id
     * @param name
     * @return {Promise}
     */
    updateId: function updateIdToDb(id, name) {
        return updateAsync(id, name);
    },

    /**
     * Remove record from memory DB
     * @param id
     * @return {Promise}
     */
    removeId: async function removeIdInDb(id) {
        return await removeAsync(id);
    }
};