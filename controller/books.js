const Book = require ('../models/book');
const fs = require('fs');
const functions = require('../utils/functions')

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        userId : req.auth.userId,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => res.status(201).json('Livre ajouté'))
        .catch((error) => res.status(400).json( {error} ));
};

exports.rateBook = (req, res, next) =>{
    Book.findOne({_id : req.params.id})
        .then(book =>{
            const bookRatings = book.ratings;

            if(bookRatings.some(rating => rating.userId === req.auth.userId))
                res.status(401).json('Vous ne pouvez pas noter plusieurs fois le même livre')

            else {
                bookRatings.push({userId : req.auth.userId, grade : req.body.rating });
                const avgRating = bookRatings.reduce((acc, current) => acc + current.grade, 0) / bookRatings.length;
                book.averageRating = avgRating;
                book.save()
                    .then((updatedBook) => res.status(200).json(updatedBook))
                    .catch((error) => res.status(401).json({ error }));

            }
        })
        .catch((error) => {res.status(400).json({ error });
    })
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne(({_id : req.params.id}))
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
};

exports.getBestRatings = (req, res, next) => {
    Book.find()
        .then((books) => {
            const bestRatings = functions.getTopThree(books);
            return res.status(200).json(bestRatings);
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete bookObject._userId;
    Book.findOne({_id : req.params.id})
        .then(book => {
            if(book.userId != req.auth.userId){
                res.status(403).json('Vous ne pouvez pas modifier un livre que vous n\'avez pas posté');
            }   else {
                    if(req.file){
                        const filename = book.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, (err) => {
                            if(err)
                                return err;
                        });
                    }
                        Book.updateOne({_id : req.params.id}, {...bookObject, _id : req.params.id})
                            .then(() => res.status(200).json('Livre modifé'))
                            .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne( {_id : req.params.id})
        .then(book => {
            if(book.userId != req.auth.userId)
                return res.status(403).json('Vous ne pouvez pas supprimer un livre que vous n\'avez pas posté');
            else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id : req.params.id})
                        .then(() => res.status(201).json('Livre supprimé'))
                        .catch((error) => res.status(400).json({ error }));
                })
            }
        })
        .catch((error) => res.status(400).json( {error} ));

};


  
  