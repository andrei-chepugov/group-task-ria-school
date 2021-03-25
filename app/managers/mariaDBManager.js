const config = require('config');
const mariadb = require('mariadb');
const generateToken = require('../helpers/generateToken.js');

const pool = mariadb.createPool(config.mariaDb);

class UserLoginError extends Error {
}

class CreateUserError extends Error {
}


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
        const rows = await conn.query(`SELECT users.users.id,
                                              users.users.firstName,
                                              users.users.lastName,
                                              users.users.email,
                                              users.users.isAdmin,
                                              users.users.token
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
 * Get login and pass from DB
 * @param {{firstName: string, lastName: string, email: string, password: string}} params
 * @return {Promise<{insertId: number} | null>}
 * @throws {CreateUserError}
 */
async function createUserInDB(params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`INSERT INTO users.users (firstName, lastName, email, pass, isAdmin, token)
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


async function getUserByToken(token) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT *
                                       FROM users.users
                                       WHERE token = ?`, token);
        if (rows[0]) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        // @todo Сделать роут для получения пользователя по токену
        throw new UserLoginError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.getUserByToken = getUserByToken;


async function f(token) {
    let conn;
    try {
        conn = await pool.getConnection();
        const user = await getUserByToken(token);
        if (user) {
            const databaseNames = await conn.query(`SELECT DISTINCT users.tables.database
                                                    FROM users.tables
                                                    WHERE id IN (SELECT users.usersTables.table_id
                                                                 FROM users.usersTables
                                                                 WHERE user_id = ?)`, user.id);
            if (databaseNames) {
                return databaseNames;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (err) {
        throw new UserLoginError(err.message);
    } finally {
        if (conn) conn.release();
    }
}

exports.f = f;