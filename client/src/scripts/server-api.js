//returns a promise with table object
export const loadTable = function(tablename)
{
    return fetch(`http://localhost:2725/get/${tablename}`)
        .then(res =>
            res.text()
        )
        .then(result =>
        {
            result = JSON.parse(result)
            result = JSON.parse(result.data)
            result = JSON.parse(result)
            let
            {
                headers
            } = result
            let
            {
                data
            } = result.data
            return result
        })
}

//loads last table that was used
export const loadLastTable = function()
{
    return loadTable('last-table')
}

//sends the new value of table for saving in db 
export const saveTable = function(tablename, newValue)
{
    return fetch(`http://localhost:2725/save/${tablename}`,
    {
        method: 'PUT',
        headers:
        {
            "content-type": 'application/json'
        },
        body: JSON.stringify(newValue)
    })
}

export const createNew = function(new_table)
{
    return fetch(`http://localhost:2725/create-new`,
    {
        method: 'PUT',
        headers:
        {
            "content-type": 'application/json'
        },
        body: JSON.stringify(new_table)
    })
}
