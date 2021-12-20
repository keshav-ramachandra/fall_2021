const express = require('express')

const Controller = require('../controllers/subs-controller')

const router = express.Router()

router.post('/sub', Controller.createSub)
router.get('/subs', Controller.getSubs)

module.exports = router