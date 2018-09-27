const express = require('express')
const router = express.Router()
const getTablesList = require('../DBrequests/get-tableslist')

router.route('/tableslist')
    .get(getTablesList)

module.exports = router