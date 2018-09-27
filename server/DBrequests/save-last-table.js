const fs = require('fs')

const saveLastTable = function(tablename)
{
    const file_name = `./db/last-table.json`
    const data = JSON.stringify({tablename: tablename})

    fs.writeFile(file_name, data, (err, data) =>
    {
        if (err) return console.log(err)
    })
}

module.exports = saveLastTable