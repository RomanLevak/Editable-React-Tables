const fs = require('fs')

const getTablesList = function(req, res, next)
{
    const folder = './db'
    const list = []

    fs.readdirSync(folder).forEach(name =>
    {
        if(name!=='last-table.json')
            list.push(name)
    })

    for (let i = 0; i < list.length; ++i)//table.json => table
    {
        list[i] = list[i].replace('.json', '')
    }

    res.json(JSON.stringify(
    {
        list: list
    }))
}

module.exports = getTablesList