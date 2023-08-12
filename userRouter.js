const express = require('express')
const router = express.Router()
const controller = require('./userController')
const authMiddleware = require('./middleware/authMiddleware')

router.post('/image', controller.saveImage)
router.get('/image', controller.getImage)
router.post('/drawing',authMiddleware, controller.saveDrawing)
router.get('/drawing', authMiddleware, controller.getDrawingsUrls)
router.get('/man', (req, res)=>res.status(200).json('success'))

module.exports = router;