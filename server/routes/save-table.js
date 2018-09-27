const express = require('express')
const router = express.Router()
const saveTable = require('../DBrequests/save-table')

router.route('/:tablename')
    .put(saveTable)

module.exports = router