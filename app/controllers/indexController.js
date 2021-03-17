// const myDb = require('../managers/redisDBManager'),
    Joi = require('joi'),
    generateId = require('../helpers/generateId')

// Simple user schema, more info: https://github.com/hapijs/joi
userSchema = Joi.object().keys({
    name: Joi.string().trim().required()
});

/**
 * @example curl -XGET "http://localhost:8081/users/1"
 */
async function getId(ctx, next) {
    let id = Number(ctx.params.id);
    let name = await myDb.getById(id);
    if (name !== null) {
        ctx.body = {id, name};
        ctx.status = 200;
    } else {
        ctx.body = 'Not Found';
        ctx.status = 404;
    }
    await next();
}

/**
 * @example curl -XGET "http://localhost:8081/users"
 */
async function list(ctx, next) {
    let records = await myDb.getAll();
    ctx.body = records;
    await next();
}

/**
 * @example curl -XPOST "http://localhost:8081/users" -d '{"id":1, "name":"New record 1"}' -H 'Content-Type: application/json'
 */
async function createItem(ctx, next) {
    // Joi validation, more info: https://github.com/hapijs/joi
    let body = await Joi.validate(ctx.request.body, userSchema, {allowUnknown: true});
    let id = body.id === undefined || body.id === null ? generateId() : body.id;

    let record = await myDb.getById(id) === null;
    if (record) {
        await myDb.setNewId(id, body.name);
        body.id = id;
        ctx.body = body;
        ctx.status = 201;
    } else {
        ctx.body = {error: 'Bad Request, id is already taken'};
        ctx.status = 400;
    }
    await next();
}

/**
 * @example curl -XPUT "http://localhost:8081/users/3" -d '{"name":"New record 3"}' -H 'Content-Type: application/json'
 */
async function updateItem(ctx, next) {
    // Joi validation, more info: https://github.com/hapijs/joi
    let body = await Joi.validate(ctx.request.body, userSchema, {allowUnknown: true});
    let id = Number(ctx.params.id);
    let record = await myDb.getById(id);
    if (record !== null) {
        await myDb.updateId(id, body.name);
        ctx.body = {id, name: body.name}
        ctx.status = 200;
    } else {
        ctx.body = {message: 'Bad Request, id is not found'};
        ctx.status = 400;
    }
    await next();
}

/**
 * @example curl -XDELETE "http://localhost:8081/users/3"
 */
async function removeItem(ctx, next) {
    let result = await myDb.removeId(ctx.params.id);
    if (result !== 0) {
        ctx.status = 204;
    } else {
        ctx.status = 404;
    }
    await next();
}

module.exports = {getId, list, createItem, updateItem, removeItem};