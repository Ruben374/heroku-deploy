const mongoose = require("mongoose");

const EstSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    nif: {
      type: Number,
      require: true,
    },
    category: {
      type: Object,
      require: true,
    },
    img: {
      type: String,
      require: true,
    },
    images: {
      type: Array,
      default: [],
    },
    phones_number: {
      type: Array,
    },
    description: {
      type: String,
      require: true,
    },
    address: {
      type: String,
       require: true,
    },
    open_to: {
      type: Array,
      default: [],
    },
    user: {
      type: Object,
      require: true,
    },
<<<<<<< HEAD
    open: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    ratingmedia:{
      type:Number,
      default:0
=======
    ratingmedia: {
      type: Number,
      default: 0,
    },
    open:{
      type:Boolean,
      default:false
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
>>>>>>> 9bb0ee888caecc12b17c8a06660502c3b0885f6c
    }
  },
  {
    timestamps: true,
  }
);
const Est = mongoose.model("Est", EstSchema);
module.exports = Est;
