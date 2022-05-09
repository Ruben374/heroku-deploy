const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },

  email: {
    require: true,
    type: String,
    unique: true,
  },

  password: {
    require: true,
    type: String,
  },

  status: {
    type: String,
    enum: ["Active", "Pending"],
    default: "Pending",
  },
 
  confirmCode: {
    type: Number,
    default: "",
  },

  avatar: {
    type: String,
    default: "",
  },
}, {
  timestamps: true
})

const user = mongoose.model('users', userSchema)

module.exports = user
