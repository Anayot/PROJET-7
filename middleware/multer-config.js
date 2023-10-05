const multer = require('multer')
// const sharp = require('sharp')

const storage = multer.memoryStorage({})

module.exports = multer({ storage }).single('image')