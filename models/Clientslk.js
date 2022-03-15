const mongoose= require('mongoose')

const Client= mongoose.model('Clients',{
    name:String,
    email:String,
    password:String
})
module.exports=Client