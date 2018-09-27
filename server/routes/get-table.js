const express = require('express')
const router = express.Router()
const getTable = require('../DBrequests/get-table')

router.route('/:tablename')
    .get(getTable)

module.exports = router