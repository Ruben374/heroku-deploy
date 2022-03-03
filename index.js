const express = require('express')
const app = express()

const port = process.env.PORT || 3005

app.use('/', (req, res) => {
  return res.status(200).send({ message: 'ola seja bm vindo amigo' })
})
app.use('/produtos', (req, res) => {
  return res.status(200).send({ message: 'um dia tu iras saber o quanto eu te amei' })
})
app.listen(port, () => {
  console.info('aplicação rodando')
})
