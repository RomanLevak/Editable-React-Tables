const express = require('express')
const router = express.Router()
const saveTable = require('../DBrequests/save-table')
const newTable = require('../DBrequests/new-table')

router.route('/')
    .put(newTable, saveTable)

module.exports = router