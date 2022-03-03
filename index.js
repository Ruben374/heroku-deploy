const express = require('express')
const app=express()
const morgan=require('morgan')
const bodyParser=require('body-parser')
const cors = require('cors')
const mongoose= require('mongoose')
const dbuser='rubenAndre'
const dbpass='l03p5D9gBLR2V4xk'
const port = process.env.PORT || 3005

app.use(cors())
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use('/', (req, res) => {
  return res.status(200).send({ message: 'ola seja bm vindo amigo' })
})

mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.t5c1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(()=>{
app.listen(port)
console.log('conectou ao banco🔥🔥🔥')
}).catch((err)=>console.log(err))
