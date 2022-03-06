const mongoose= require('mongoose')

const user= mongoose.model('users',{
    name:String,
    email:String,
    password:String
})
module.exports=user