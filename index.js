const express = require('express')
const app = express()

const port = process.env.PORT || 3005

app.use('/', (req, res) => {
  return res.status(200).send({ message: 'ola seja bm vindo' })
})

app.listen(port, () => {
  console.info('aplicação rodando')
})
