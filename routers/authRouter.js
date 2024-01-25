const express = require('express')
const router = express.Router()
const controller = require('../controllers/AuthController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', [
  check('username', 'Имя пользователя не может быть пустым').notEmpty(),
  check('email', 'Неверный email').isEmail().notEmpty(),
  check('password', 'Пароль должен быть более 4 и менее 30 символов').isLength({min: 4, max: 30}),
], controller.registration)
router.post('/login', controller.login)
router.get('/check', authMiddleware, controller.check)
router.get('/users',authMiddleware, controller.getUsers)

module.exports = router;