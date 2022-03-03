const express = require('express')
const app = express()

const port = 3005

app.use('/', (req, res) => {
  res.send('ola welcome')
})

app.listen(port, () => {
  console.log('aplicação rodando')
})
