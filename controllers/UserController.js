const fs = require('fs')
const path = require('path')
const Drawing = require('../models/Drawing')
const User = require('../models/User')
const GALLERY_PATH = path.resolve(__dirname,'../gallery')
const IMAGE_PATH = path.resolve(__dirname,'../images')

class UserController {
  saveImage(req, res) {
    try {
      const data = req.body.img.replace('data:image/png;base64,','')
      fs.writeFileSync(path.resolve(IMAGE_PATH, `${req.query.id}.jpg`), data, 'base64')
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
        return res.status(400).json('Рисунок уже добавлен другим пользователем или вами')
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
      const file = fs.readFileSync(path.resolve(IMAGE_PATH, `${req.query.id}.jpg`))
      const data = `data:image/png;base64,` + file.toString('base64')
      res.json(data)
    } catch (e) {
      return res.status(500).json('Image not found')
    }
  }
  getGalleryImage(req, res) {
    try {
      const file = fs.readFileSync(path.resolve(GALLERY_PATH, `${req.query.id}`))
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
  async getGalleryDrawings(req, res) {
    fs.readdir(GALLERY_PATH, (err, files) => {
      if (err) {
        console.error('Ошибка чтения папки:', err);
        res.status(500).send('Внутренняя ошибка сервера');
        return;
      }
      
      const images = files.map((file) => {
        const filePath = path.resolve(GALLERY_PATH, file);
        const image = fs.readFileSync(filePath);
        return {src: `data:image/png;base64,` + image.toString('base64'), image_name: file};
      });
      
      res.status(200).json(images);
    });
  }
}

module.exports = new UserController()