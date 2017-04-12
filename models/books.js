var mongoose = require('mongoose');

//Books Schema
var BookSchema = new mongoose.Schema({
   title: {
       type: String,
       required: true
   },
   genre: {
       type: String,
       required: true
   },
   description: {
       type: String
   },
   author: {
       type: String
   },
   publisher: {
       type: String
   },
   pages: {
       type: String
   },
   img_url: {
       type: String
   },
   buy_url: {
       type: String
   },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var Book = module.exports = mongoose.model('Book', BookSchema);

// Get Books
module.exports.getBooks = function(callback, limit){
    Book.find(callback).limit(limit);
}

// Get Book By Id
module.exports.getBookById = function(id, callback){
    Book.findById(id, callback);
}

// Create Book
module.exports.addBook = function(book, callback){
    Book.create(book, callback);
}