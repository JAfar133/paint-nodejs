const {Schema, model} = require('mongoose')

const Drawing = new Schema({
  url: {type: String, required: true, unique: true},
})

module.exports = model('Drawing', Drawing);