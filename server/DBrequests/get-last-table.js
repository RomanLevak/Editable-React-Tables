const getTable = require('./get-table')
const last_table = require('../db/last-table')

const getLastTable = function(req, res, next)
{
    req.params.tablename = last_table.tablename
    getTable(req, res, next)
}

module.exports = getLastTable