const express = require('express')
const router = express.Router()
const getLastTable = require('../DBrequests/get-last-table')

router.route('/last-table')
    .get(getLastTable)

module.exports = router