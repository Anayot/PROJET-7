const sharp = require('sharp')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

module.exports = (req, res, next) => {
    if(!req.file) {
        return res.status(400).json({ error: 'Aucun fichier' })
    }

    const name = req.file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[req.file.mimetype]
    req.file.filename = name + '_' + Date.now() + '.' + extension


    sharp(req.file.buffer)
    .resize({width: 200})
    .toFile(`./images/${req.file.filename}`)
    .then(() => next())
    .catch(error => res.status(403).json({ error }))

}