const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const saveTable = require('./routes/save-table')
const getTable = require('./routes/get-table')
const newTable = require('./routes/new-table')
const getLastTable = require('./routes/get-last-table')
const getTableList = require('./routes/get-tablelist')

const port = 2725

const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use(express.static('../client/public'))

app.use('/get', getLastTable)
app.use('/get', getTableList)
app.use('/get', getTable)
app.use('/save', saveTable)
app.use('/create-new', newTable)

app.listen(port, () =>
{
    console.log(`server is running on port: ${port}`)
})