const {Schema, model} = require('mongoose')

const User = new Schema({
  username: {type: String, required: true, unique: false},
  email: {type: String, required: true, unique: true},
  role: {type: String, required: true, default: 'user'},
  password: {type: String, required: true},
  drawings: [{ type: Schema.Types.ObjectId, ref: 'Drawing' }]
})

module.exports = model('User', User);