const fs = require('fs')

const teste = url => {
  fs.rm(url, { recursive: false }, err => {
    if (err) {
      console.error(err)
    } else {
      console.log('Non Recursive: Directory Deleted!')
    }
  })
}
module.exports = teste
