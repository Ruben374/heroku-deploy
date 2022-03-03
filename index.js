const express = require("express")
const app = express()

const port = process.env.PORT || 3005

app.use("/", function (req, res) {
  res.send("ola welcome")
})

app.listen(port, () => {
  console.info("aplicação rodando")
})
