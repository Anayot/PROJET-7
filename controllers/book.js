const books = require('../models/books')

exports.createBook = (req, res) => {
    if(!req.body.book) {
        return res.status(400).json({message: 'Malformed parameters'})
    }
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

exports.createRating = (req, res) => {
    books.findOne({_id: req.params.id})
        .then((book) => {
            if(book.ratings.find(rating => {
                return rating.userId === req.auth.userId
            })) {
                return res.status(401).json({message: 'User already rated this book'})
            }
            book.ratings.push({userId: req.auth.userId, grade: req.body.rating})
            book.averageRating = (book.ratings.reduce((sum, rating) => {return sum + rating.grade}, 0) / book.ratings.length).toFixed(2)
            books.updateOne({_id: req.params.id}, 
                {
                    $set: {
                        'ratings': book.ratings, 
                        'averageRating': book.averageRating
                    }
                })
                .then(() => res.status(201).json({...book.toJSON()}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(404).json({ error }))
}

exports.modifyBook = (req, res) => {
    // Modifie l'image
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}
    // Evite qu'un autre utilisateur crée un objet et change l'id du vrai utilisateur
    delete bookObject._userId
    // Authentification renforcée pour les modifications - Propre à l'id de l'utilisateur
    books.findOne({_id: req.params.id})
        .then((book) => {
            if(book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' })
            } else {
                books.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
                    .then(() => res.status(201).json({ message: 'Objet modifié' }))
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch(error => res.status(400).json({ error }))

}

exports.deleteBook = (req, res) => {
    // Authentification renforcée pour les modifications - Propre à l'id de l'utilisateur
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

exports.getAllBooks = (req,res) => {
    books.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))

}

exports.getOneBook = (req, res) => {
    books.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }))

}

exports.getBestRating = (req, res) => {
    // Récupérer l'objet en base
    books.find().sort({'averageRating': -1, 'year': -1}).limit(3)
        .then((result) => res.status(200).json(result))
        .catch(error => res.status(403).json({ error }))
}