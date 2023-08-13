const fs = require('fs')
const path = require('path')
const Drawing = require('./models/Drawing')
const User = require('./models/User')
class UserController {
  saveImage(req, res) {
    try {
      const data = req.body.img.replace('data:image/png;base64,','')
      fs.writeFileSync(path.resolve(__dirname,'images', `${req.query.id}.jpg`), data, 'base64')
      return res.status(200).json({message: "Рисунок сохранен на сервере"})
    }catch (e){
      console.log(e)
      return res.status(500).json('error')
    }
  }
  async saveDrawing(req, res){
    try {
      const drawing_id = req.query.id;
      const drawingExists = await Drawing.exists({url: drawing_id})
      
      if(drawingExists){
        return res.status(400).json('Рисунок уже существует')
      }
      const drawing = new Drawing({url: drawing_id})
      await drawing.save();
      const user = await User.findOne({email: req.user.email})
      user.drawings.push(drawing._id);
      await user.save();
      
      return res.status(200).json('Drawing added successfully');
      
    }catch (e){
      console.log(e)
      return res.status(500).json('error')
    }
  }
  getImage(req, res) {
    try {
      const file = fs.readFileSync(path.resolve(__dirname, 'images', `${req.query.id}.jpg`))
      const data = `data:image/png;base64,` + file.toString('base64')
      res.json(data)
    } catch (e) {
      return res.status(500).json('Image not found')
    }
  }
  async getDrawingsUrls(req, res) {
    try {
      const user = await User.findOne({email: req.user.email}).populate('drawings');
      const urls = user.drawings.map((drawing)=>drawing.url)
      return res.status(200).json(urls)
    }catch (e) {
    }
  }
}

module.exports = new UserController()