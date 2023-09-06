const {Schema, model} = require('mongoose')

const Gallery = new Schema({
  username: {type: String, required: true, unique: false},
  drawings: [{ type: Schema.Types.ObjectId, ref: 'Drawing' }]
})

module.exports = model('Gallery', Gallery);