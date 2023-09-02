const express = require('express')
const router = express.Router()
const controller = require('../controllers/MessageController')

router.get('/get/:canvas_id', controller.getMessagesByCanvasId)

module.exports = router;