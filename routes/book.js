const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const router = express.Router()

const bookCtrl = require('../controllers/book')

router.get('/', bookCtrl.getAllBooks)
router.post('/', auth, multer, bookCtrl.createBook)
router.get('/:id', bookCtrl.getOneBook)
router.put('/:id', auth, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.post('/:id/rating', auth)
router.get('/bestrating')


module.exports = router