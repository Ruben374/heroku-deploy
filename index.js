const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dbuser = 'rubenAndre'
const dbpass = 'l03p5D9gBLR2V4xk'
const port = process.env.PORT || 3005

app.use(cors())
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const ClientRoute = require('./routes/clients')
const UserRoute = require('./routes/users')
const CategoryRoute = require('./routes/category')
const EstRoute = require('./routes/est')
const ServicesRoute = require('./routes/services')
//const AppointmentsRoute = require('./routes/Appointments')

app.use('/clients', ClientRoute)
app.use('/users', UserRoute)
app.use('/category', CategoryRoute)
app.use('/est', EstRoute)
app.use('/services', ServicesRoute)
//app.use('/appointments', AppointmentsRoute)


app.use((req, res, next) => {
  const erro = new Error('Pagina não encontrada')
  erro.status = 404
  next(erro)
})


app.use((error, req, res, next) => {
  res.status(error.status || 500)
  return res.send({
    erro: {
      mensagem: error.message
    }
  })
})

mongoose
  .connect(
    `mongodb+srv://${dbuser}:${dbpass}@cluster0.t5c1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port)
    console.log('conectou ao banco🔥🔥🔥')
  })
  .catch(err => console.log(err))
