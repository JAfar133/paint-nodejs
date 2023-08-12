const User = require('./models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

const generateAccessToken = (id, email) => {
  const payload = {id, email}
  return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "24h"})
}

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Ошибка регистрации', errors})
      }
      console.log(req.body)
      const {email, username, password} = req.body;
      console.log(username)
      const candidate = await User.findOne({email})
      if (candidate) {
        return res.status(400).json({message: 'Этот email уже используется'})
      }
      const hashPassword = bcrypt.hashSync(password, 7)
      const user = new User({username, email, password: hashPassword})
      
      await user.save()
      return res.json({message: "Пользователь зарегестрирован", user: user})
      
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'registration error'})
    }
  }
  
  async login(req, res) {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({email})
      if (!user) {
        return res.status(400).json({message: 'Пользователь не найден'})
      }
      
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({message: 'Неверный пароль'})
      }
      
      const token = generateAccessToken(user._id, user.email)
      return res.json({token: token, user: user})
      
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'login error'})
    }
  }
  
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users)
    } catch (e) {
    
    }
  }
  async check(req, res) {
    const token = generateAccessToken(req.user.id, req.user.email)
    try {
      const user = await User.findOne({email: req.user.email})
      return res.json({token, user})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'CheckError'})
    }
  }
}

module.exports = new authController()