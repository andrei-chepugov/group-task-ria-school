const fs = require('fs');
const config = require('config');
const mariadb = require('mariadb');
const generateToken = require('../helpers/generateToken.js');

const pool = mariadb.createPool(config.mariaDb);
const initMariaDb = fs.readFileSync('./app/managers/queries/initDBMariaDb/initDB.sql', 'utf-8');

class CreateUserError extends Error {
}

class UserLoginError extends Error {
}

class UpdateUserError extends Error {
}

class DeleteUserError extends Error {
}

class UsersTokenError extends Error {
}

class UserTokenError extends Error {
}

class UserEmailError extends Error {
}

class GetNames extends Error {
}


/**
 * Initiate database
 */
(async function initDB() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(initMariaDb);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
})()


/**
 * @param {Array<{database: string, table: string}>} tables
 * @return {Promise<{affectedRows: number} | null>}
 * @throws {UpdateUserError}
 */
async function importTablesFromClickhouseIntoDB(tables) {
    let conn;
    try {
        let query = 'INSERT IGNORE INTO users.tables (`database`, `table`) VALUES ';
        let queryParams = [];
        let querySets = [];
        for (let table of tables) {
            querySets.push(`(?, ?)`);
            queryParams.push(table.database);
            queryParams.push(table.table);
        }
        query += querySets.join(', ');
        conn = await pool.getConnection();
        const res = await conn.query(query, queryParams);
        return res.affectedRows;
    } catch (err) {
        throw new UpdateUserError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.importTablesFromClickhouseIntoDB = importTablesFromClickhouseIntoDB;


/**
 * @return {Promise<{affectedRows: number} | null>}
 * @throws {UpdateUserError}
 */
async function exportTablesFromMariaDB() {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query('SELECT * FROM users.tables ');
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}

exports.exportTablesFromMariaDB = exportTablesFromMariaDB;


/**
 * Create user in DB
 * @param {{firstName: string, lastName: string, email: string, password: string}} params
 * @return {Promise<{insertId: number} | null>}
 * @throws {CreateUserError}
 */
async function createUserInDB(params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`
            INSERT INTO users.users (firstName, lastName, email, pass, isAdmin, token)
            VALUES (?, ?, ?, ?, ?, ?);`, [params.name, params.surname, params.email, params.password, 0, generateToken()]);
        if (res.affectedRows === 1) {
            return res.insertId;
        } else {
            return null;
        }
    } catch (err) {
        throw new CreateUserError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.createUserInDB = createUserInDB;


/**
 * Get login and pass from DB
 * @param {{email: string, password: string}} params
 * @return {Promise<{id: number, firstName: string, lastName: string, email: string, isAdmin: string, token: string} | null>}
 * @throws {UserLoginError}
 */
async function getLoginUserFromDB(params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT id, firstName, lastName, email, isAdmin, token
            FROM users.users
            WHERE email = ?
              AND pass = ?;`, [params.email, params.password]);
        if (rows[0]) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        throw new UserLoginError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getLoginUserFromDB = getLoginUserFromDB;


/**
 * Update user from DB
 * @description to admins usage only (modifies isAdmin field params)
 * @param {{id: number, firstName: string, lastName: string, email: string, pass: string, isAdmin: boolean}} params
 * @return {Promise<{affectedRows: number} | null>}
 * @throws {UpdateUserError}
 */
async function updateUserInDB(params) {
    let conn;
    try {
        let query = `UPDATE users.users
                     SET `;
        let queryParams = [];
        let querySets = [];
        if (params.firstName !== undefined) {
            querySets.push(`firstName = ?`);
            queryParams.push(params.firstName);
        }
        if (params.lastName !== undefined) {
            querySets.push(`lastName = ?`);
            queryParams.push(params.lastName);
        }
        if (params.email !== undefined) {
            querySets.push(`email = ?`);
            queryParams.push(params.email);
        }
        if (params.pass !== undefined) {
            querySets.push(`pass = ?`);
            queryParams.push(params.pass);
        }
        if (params.isAdmin !== undefined) {
            querySets.push(`isAdmin = ?`);
            queryParams.push(params.isAdmin);
        }
        query += querySets.join(', ');
        query += ` WHERE id = ?;`;
        queryParams.push(params.id);
        conn = await pool.getConnection();
        const res = await conn.query(query, queryParams);
        if (res.affectedRows === 1) {
            return res.affectedRows;
        } else {
            return null;
        }
    } catch (err) {
        throw new UpdateUserError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.updateUserInDB = updateUserInDB;


/**
 * Delete user from DB
 * @param {{id: number}} id
 * @return {Promise<{affectedRows: number} | null>}
 * @throws {DeleteUserError}
 */
async function deleteUserInDB(id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`DELETE
                                      FROM users.users
                                      WHERE id = ?;`, [id]);
        if (res.affectedRows === 1) {
            return res.affectedRows;
        } else {
            return null;
        }
    } catch (err) {
        throw new DeleteUserError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.deleteUserInDB = deleteUserInDB;


/**
 * Get users from DB
 * @return {Promise<{rows: string} | null>}
 * @throws {UsersTokenError}
 */
async function getUsersByTokenFromDB() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT *
            FROM users.users;`);
        if (rows) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        throw new UsersTokenError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getUsersByTokenFromDB = getUsersByTokenFromDB;


/**
 * Get user by token from DB
 * @param token
 * @return {Promise<{isAdmin: string} | null>}
 * @throws {UserTokenError}
 */
async function getUserByTokenFromDB(token) {
    if (typeof token !== 'string') {
        return null;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT *
            FROM users.users
            WHERE token = ?;`, [token]);
        if (rows[0]) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        throw new UserTokenError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getUserByTokenFromDB = getUserByTokenFromDB;


/**
 * Get user by email from DB
 * @param email
 * @return {Promise<{rows[0]: string} | null>}
 * @throws {UserEmailError}
 */
async function getUserByEmailFromDB(email) {
    if (typeof email !== 'string') {
        return null;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT *
            FROM users.users
            WHERE email = ?;`, [email]);
        if (rows[0]) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        throw new UserEmailError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getUserByEmailFromDB = getUserByEmailFromDB;


/**
 * Get user granted from DB
 * @param id
 * @return {Promise<{rows[0]: string} | null>}
 * @throws {UserEmailError}
 */
async function getUserGrantedTablesFromDB(id) {
    if (typeof id !== 'string') {
        return null;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT *
            FROM users.usersTables
                     INNER JOIN users.tables ON table_id = tables.id
            WHERE user_id = ?;`, [id]);
        if (rows[0]) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        throw new UserEmailError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getUserGrantedTablesFromDB = getUserGrantedTablesFromDB;


/**
 * Update user from DB
 * @description to admins usage only (modifies isAdmin field params)
 * @param {{user_id: string|number, tables: Array<{table_id: number}>>}} params
 * @return {Promise<{affectedRows: number} | null>}
 * @throws {UpdateUserError}
 */
async function updateUserGrantedTablesInDB(params) {
    if (!params || !params.user_id || !Array.isArray(params.tables) || !params.tables.length) {
        throw new Error(`invalid input params: ${JSON.stringify(params)}`);
    }
    let conn;
    try {
        let query = 'INSERT IGNORE INTO users.usersTables (user_id, table_id) VALUES ';
        let queryParams = [];
        let querySets = [];
        for (let table of params.tables) {
            querySets.push(`(?, ?)`);
            queryParams.push(params.user_id);
            queryParams.push(table.table_id);
        }
        query += querySets.join(', ');
        conn = await pool.getConnection();
        const res = await conn.query(query, queryParams);
        return res.affectedRows;
    } catch (err) {
        throw new UpdateUserError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.updateUserGrantedTablesInDB = updateUserGrantedTablesInDB;


/**
 * Update user from DB
 * @description to admins usage only (modifies isAdmin field params)
 * @param {{user_id: string|number, tables: Array<{table_id: number}>>}} params
 * @return {Promise<{affectedRows: number} | null>}
 * @throws {UpdateUserError}
 */
async function deleteUserGrantedTablesInDB(params) {
    if (!params || !params.user_id || !Array.isArray(params.tables) || !params.tables.length) {
        throw new Error(`invalid input params: ${JSON.stringify(params)}`);
    }
    let conn;
    try {
        let query = 'DELETE IGNORE FROM users.usersTables WHERE ';
        let queryParams = [];
        let querySets = [];
        for (let table of params.tables) {
            querySets.push(`(user_id = ? AND table_id = ?)`);
            queryParams.push(params.user_id);
            queryParams.push(table.table_id);
        }
        query += querySets.join(' OR ');
        conn = await pool.getConnection();
        const res = await conn.query(query, queryParams);
        return res.affectedRows;
    } catch (err) {
        throw new UpdateUserError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.deleteUserGrantedTablesInDB = deleteUserGrantedTablesInDB;


/**
 * Get database names from DB
 * @param token
 * @return {Promise<{query: string} | null>}
 * @throws {GetNames}
 */
async function getDatabaseNamesByToken(token) {
    let conn;
    try {
        conn = await pool.getConnection();
        if (token) {
            return conn.query(`
                SELECT DISTINCT tables.database as name
                FROM users.tables
                WHERE id IN (SELECT table_id
                             FROM users.usersTables
                             WHERE user_id IN (SELECT id
                                               FROM users.users
                                               WHERE token = ?));`, [token]);
        } else {
            return null;
        }
    } catch (err) {
        throw new GetNames(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getDatabaseNamesByToken = getDatabaseNamesByToken;


/**
 * Get table names from DB
 * @param token
 * @param databaseName
 * @return {Promise<{query: string} | null>}
 * @throws {GetNames}
 */
async function getTableNameInDatabaseByToken(token, databaseName) {
    let conn;
    try {
        conn = await pool.getConnection();
        if (token) {
            return conn.query(`
                SELECT tables.table as name
                FROM users.tables
                WHERE id IN (SELECT table_id
                             FROM users.usersTables
                             WHERE user_id IN (SELECT id
                                               FROM users.users
                                               WHERE token = ?))
                  AND tables.database = ?;`, [token, databaseName]);
        } else {
            return null;
        }
    } catch (err) {
        throw new GetNames(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getTableNameInDatabaseByToken = getTableNameInDatabaseByToken;


/**
 * Get table and database accessible for user from DB
 * @param token
 * @return {Promise<{query: string} | null>}
 * @throws {GetNames}
 */
async function getTablesDatabaseByToken(token) {
    let conn;
    try {
        conn = await pool.getConnection();
        if (token) {
            const databaseNames = await conn.query(`
                SELECT DISTINCT tables.database, tables.table
                FROM users.tables
                WHERE id IN (SELECT table_id
                             FROM users.usersTables
                             WHERE user_id IN (SELECT id
                                               FROM users.users
                                               WHERE token = ?));`, [token]);
            if (databaseNames) {
                return databaseNames;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (err) {
        throw new GetNames(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getTablesDatabaseByToken = getTablesDatabaseByToken;