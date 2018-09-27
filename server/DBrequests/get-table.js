const fs = require('fs')
const saveLastTable = require('./save-last-table')

const getTable = function(req, res, params)
{
    const file_name = `./db/${req.params.tablename}.json`

    fs.readFile(file_name, 'utf-8', (err, data) =>
    {
        if (err) return console.log(err)

        data = JSON.stringify(data)
        saveLastTable(req.params.tablename) //saves the last table that was used to show it when the page will be opened next time
        res.json(
        {
            data
        })
    })
}

module.exports = getTable