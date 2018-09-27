const fs = require('fs')
const saveLastTable = require('./save-last-table')

//saves the user's changes to db
const saveTable = function(req, res, next)
{
    const file_name = `./db/${req.body.name}.json`
    let new_table = null
    if (req.create_new)
    {
        new_table = JSON.stringify(req.new_body)
    }
    else
    {
        new_table = JSON.stringify(req.body)
    }
    fs.writeFile(file_name, new_table || '', (err, data) =>
    {
        if (err) return console.log(err)
        // saveLastTable(req.params.tablename) //saves the last table that was used to show it when the page will be opened next time
        res.json('saved')
    })
}

module.exports = saveTable