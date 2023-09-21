const books = require('../models/books')

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new books({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré' }))
        .catch(error => res.status(400).json({ error }))
}

exports.modifyBook = (req, res, next) => {
    books.findOne({_id: req.params.id})
        .then((book) => {
            if(book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' })
            } else {
                books.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
                    .then(() => res.status(201).json({ message: 'Objet modifié' }))
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch(error => res.status(400).json({ error }))

}

exports.deleteBook = (req, res, next) => {
    books.findOne({_id: req.params.id})
        .then((book) => {
            if(book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' })
            } else {
                books.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                    .catch(error => res.status(401).json({ error }))
            }
        })
        .catch(error => res.status(500).json({ error }))
}

exports.getAllBooks = (req,res, next) => {
    books.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))

}

exports.getOneBook = (req, res, next) => {
    books.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }))

}