const config = require('config');
const mariadb = require('mariadb');
const generateToken = require('../helpers/generateToken.js');

const pool = mariadb.createPool(config.mariaDb);

class CreateUserError extends Error {
}

class UserLoginError extends Error {
}

class UpdateUserError extends Error {
}

class DeleteUserError extends Error {
}

class UserTokenError extends Error {
}

class GetNames extends Error {
}


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
            VALUES (?, ?, ?, ?, ?, ?)`, [params.name, params.surname, params.email, params.password, 0, generateToken()]);
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
              AND pass = ?`, [params.email, params.password]);
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
 * @param {{id: number}} id
 * @return {Promise<{affectedRows: number} | null>}
 * @throws {UpdateUserError}
 */
async function updateUserInDB(id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`UPDATE users.users
                                          SET ? = ?
                                      WHERE id = ?;`, [id]);
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
 * Get user from DB
 * @param token
 * @return {Promise<{rows[0]: string} | null>}
 * @throws {UserTokenError}
 */
async function getUserByTokenFromDB(token) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT *
            FROM users.users
            WHERE token = ?`, [token]);
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
                                               WHERE token = ?))`, [token]);
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
                  AND tables.database = ?`, [token, databaseName]);
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
                                               WHERE token = ?))`, [token]);
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