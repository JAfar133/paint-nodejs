const {Schema, model} = require('mongoose')

const Message = new Schema({
  username: {type: String, required: true},
  date: {type: Date, required: true},
  text: {type: String, required: true},
  canvas_id: {type: String, required: true, unique: false},
})

module.exports = model('Message', Message);