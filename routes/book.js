const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const router = express.Router()
const sharp = require('../middleware/sharp-config')
const bookCtrl = require('../controllers/book')

router.post('/', auth, multer, sharp, bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.createRating)

router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook)

router.delete('/:id', auth, bookCtrl.deleteBook)

router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.getBestRating)
router.get('/:id', bookCtrl.getOneBook)

module.exports = router