const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

const bookCtrl = require('../controllers/book')

router.get('/')
router.post('/', auth, bookCtrl.createBook)
router.get('/:id')
router.put('/:id', auth, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
// router.post('/:id/rating', auth)
// router.get('/bestrating')


module.exports = router