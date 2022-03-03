const multer = require('multer')
const crypto = require('crypto')

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './uploads')
  },
  filename: function (request, file, callback) {
    crypto.randomBytes(16, (err, hash) => {
      if (err) callback(err)
      const filename = `${hash.toString('hex')}-${file.originalname}`
      callback(null, filename)
    })
  }
})

const fileFilter = (request, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

module.exports = upload
