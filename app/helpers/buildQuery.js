function buildFields(fieldsList) {
    let fieldNames = [];
    for (let i = 0; i < fieldsList.length; i++) {
        let field = fieldsList[i];
        let fieldName = `${field.database}.${field.table}.${field.name}`;
        if (field.function) {
            fieldName = `${field.function}(${fieldName})`;
        }
        fieldNames.push(fieldName);
    }
    return fieldNames.join(', ');
}

function buildSource(source) {
    let sourceNames = [];
    let joinList = source.joins;
    let sourceName = `${source.database}.${source.table}`;
    sourceNames.push(sourceName);
    if (Array.isArray(joinList)) {
        for (let i = 0; i < joinList.length; i++) {
            let join = joinList[i];
            let joinName = `
JOIN ${join.database}.${join.table} 
ON ${join.database}.${join.table}.${join.foreignKey} = ${source.database}.${source.table}.${join.targetKey}`;
            sourceNames.push(joinName);
        }
    }
    return sourceNames.join(' ');
}

function buildFilters(filterList) {
    let filters = [];
    for (let i = 0; i < filterList.length; i++) {
        let actions = [];
        let filter = filterList[i];
        let filterName = `${filter.field.database}.${filter.field.table}.${filter.field.name}`;
        for (let i = 0; i < filter.actions.length; i++) {
            let action = `${filterName} ${filter.actions[i].op} '${filter.actions[i].value}'`;
            actions.push(action);
        }
        filters.push('(' + actions.join(' OR ') + ')');
    }
    return filters.join(' AND ');
}

function buildGroup(groupList) {
    let groupNames = [];
    for (let i = 0; i < groupList.length; i++) {
        let group = groupList[i];
        let groupName = `${group.database}.${group.table}.${group.name}`;
        groupNames.push(groupName);
    }
    return groupNames.join(', ');
}

function buildOrder(orderList) {
    let orderNames = [];
    for (let i = 0; i < orderList.length; i++) {
        let order = orderList[i];
        let orderName = `${order.database}.${order.table}.${order.name} ${order.type ? String(order.type).toUpperCase() : ''}`;
        orderNames.push(orderName);
    }
    return orderNames.join(', ');
}

function buildQuery(params) {
    let result = '';

    const limit = params.limit > 0 && params.limit < 1000 ? params.limit : 1000;

    result = `SELECT ${buildFields(params.fields)}`;
    result += ` FROM ${buildSource(params.source)}`;
    result += Array.isArray(params.filters) ? ` WHERE ${buildFilters(params.filters)}` : '';
    result += Array.isArray(params.group) ? ` GROUP BY ${buildGroup(params.group)}` : '';
    result += Array.isArray(params.order) ? ` ORDER BY ${buildOrder(params.order)}` : '';
    result += ` LIMIT ${limit}`;

    return result;
}

exports.buildQuery = buildQuery;

