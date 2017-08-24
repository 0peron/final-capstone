/*express resources*/
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var http = require('http');
var Book = require('./models/book');
var Comment = require('./models/comment');

/*api resources*/
var unirest = require('unirest');
var events = require('events');

/*db resources*/
var mongoose = require('mongoose');
var config = require('./config');

/*app settings*/
var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));

var server = http.Server(app);

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

var getBookApi = function(searchTerm) {
    console.log(searchTerm);
    var emitter = new events.EventEmitter();
    var key = 'AIzaSyDiIDDnvki5T6i83J2pS-m2VsnjhINjF5E'
        // unirest.get('https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&key=AIzaSyDiIDDnvki5T6i83J2pS-m2VsnjhINjF5E')
    unirest.get('https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&maxResults=12')
        .end(function(response) {
            if (response.ok) {
                emitter.emit('end', response.body);
            }
            else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
};

app.get('/book/:searchTerm', function(req, res) {
    console.log(req.params.searchTerm);
    var searchBook = getBookApi(req.params.searchTerm);

    searchBook.on('end', function(book) {
        if (typeof book == undefined) {
            res.sendStatus(404);
        }
        else if (!book) {
            res.sendStatus(404);
        }
        else if (book.length == 0) {
            res.sendStatus(404);
        }
        else {
            res.json(book);
        }
    });
    searchBook.on('error', function(code) {
        res.sendStatus(code);
    });
});

app.get('/populate-cart', function(req, res) {
    Book.find(function(err, book) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(book);
    });
});

app.post('/add-to-cart', function(req, res) {
    console.log('image', req.body.image);
    var requiredFields = ['name', 'link', 'description', 'image'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = 'Missing `' + field + '` in request body';
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Book.create({
            name: req.body.name,
            link: req.body.link,
            idValue: req.body.idValue,
            description: req.body.description,
            image: req.body.image
        },
        function(err, book) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            }
            res.status(201).json(book);
        });

});

app.delete('/delete-cart', function(req, res) {
    console.log(req.body.idValue);

    Book.find(function(err, book) {
        if (err) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }
        Book.remove({
                idValue: req.body.idValue
            },
            function() {
                res.status(201).json(book);
            });
    });
});

app.get('/populate-notes', function(req, res) {
    Book.find(function(err, notes) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(notes);
    });
});

app.post('/add-to-comment', function(req, res) {
    console.log('comment', req.body.text);
    var requiredFields = ['text'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = 'Missing `' + field + '` in request body';
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Comment.create({
            text: req.body.text,
            Commentid: req.body.commentId,
        },
        function(err, notes) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            }
            res.status(201).json(notes);
        });

});

// app.post('/add-to-comment', function(req, res) {
//     console.log('comment', req.body.text);
//     var requiredFields = ['text'];
//     for (var i = 0; i < requiredFields.length; i++) {
//         var field = requiredFields[i];
//         if (!(field in req.body)) {
//             var message = 'Missing `' + field + '` in request body';
//             console.error(message);
//             return res.status(400).send(message);
//         }
//     }

//     Comment.create({
//             text: req.body.notes,
//             _id: req.body._id,
//         },
//         function(err, notes, book) {
//             if (err) {
//                 return res.status(500).json({
//                     message: err
//                 });
//             }
//             //  Book
//             //  .findOne({idValue: req.body.bookId})
//             //  .exec(function(error, book){
//             //  book.notes.push(notes) {
//             //     book.save(function(err){
//             //      if (err) {
//             //          return res.status(500).json({
//             //         message: err
//             //     });
//             //  });
//             //  }}
         
//             res.status(201).json(notes);
//         });
   
    // populate('notes').
    // exec(function (err, book){
    //     if (err) return res.status(500).json({
    //         message:err
    //     });
    //     console.log('The note is %s', book.notes.notes);
    // });

// });
    

app.delete('/delete-comment', function(req, res) {
    console.log(req.body.commentId);

    Comment.find(function(err, notes) {
        if (err) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }
        Comment.remove({
                idValue: req.body.commentId
            },
            function() {
                res.status(201).json(notes);
            });
    });
});



app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
app.listen(process.env.PORT || 5000, process.env.IP);
