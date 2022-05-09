const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  est: {
    type: Object,
    require: true,
  },
  preco: {
    type: Number,
    require: true,
  },
  horarios: {
    type: Array,
    default: [],
  },
});
const Services = mongoose.model("Services", ServicesSchema);
module.exports = Services;
