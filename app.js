var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var fs = require('fs');

app.use(function(req, res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});

app.set('view engine', 'ejs');    
app.set('views', path.join(__dirname, 'views'));

var multer = require('multer');
var upload = multer({dest: 'uploads/'});
/*var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'public/uploads/');
   },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
var upload = multer({ storage: storage });*/

// configure body parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import Models
Genre = require('./models/genres');
Book = require('./models/books');

//Connect to mongoose
var dbserver = 'mongodb://localhost';
var dbname = '/bookstore'
mongoose.connect(dbserver + dbname);
var db = mongoose.connection;

//Route
app.get('/', function(req, res) {
    res.send('Please use /api/books or /api/genres ...');
});

app.get('/api', function(req, res) {
    res.send('Api: <a href="/api/books">books</a> or <a href="/api/genres">genres</a>?');
});

app.get('/api/genres', function(req, res){
    Genre.getGenres(function(err, genres){
       if (err){
           throw err;
       } 
        
        res.json(genres);
    });
});

app.post('/api/genres', function(req, res, next){
    var genre = req.body;
    Genre.addGenre(genre, function(err, genre){
        console.log(req.body);
        
       if (err){
           //throw err;
           return next(genre);
       } 
        
        
        res.json(genre);
    });
});

app.get('/api/books', function(req, res){
    Book.getBooks(function(err, books){
       if (err){
           throw err;
       } 
        
        //res.json(books);
        res.render('index', {title: 'Express', books: books});
    });
});

app.post('/api/books', upload.any(), function(req, res, next){
    if (req.files) {
        console.log(req.files);
        console.log(req.body);

        req.files.forEach(function(file) {
            console.log(file);
            var filename = (new Date).valueOf()+"."+file.originalname;
            console.log(filename);
            console.log(file.path);
                fs.rename(file.path, 'public/uploads/'+filename, function(err){
                    if (err) throw err;
                    
                    var book = req.body;
                        book['img_url'] = filename;
                        console.log(book);

                    Book.addBook(book, function(err, book){
                       if (err){
                           //throw err;
                           return next(book);
                       } 

                        res.json(book);
                        console.log('file uploaded...');
                    });
                });
        });
    } else {
        res.send('No files selected.');
    }
});

app.get('/api/book/:_id', function(req, res){
    Book.getBookById(req.params._id, function(err, book){
       if (err){
           throw err;
       } 
        
        res.json(book);
    });
});

app.listen(3000);
console.log('Running on port 3000...');

