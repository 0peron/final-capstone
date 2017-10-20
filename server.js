/*express resources*/
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var http = require('http');
var Book = require('./models/book');
var Comment = require('./models/comment');
var passport = require('passport');
var {router: usersRouter} = require('./users');
var {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');
var methodOverride = require('method-override');


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


app.use(methodOverride('_method'));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});


app.use('/users/', usersRouter);
app.use('/login/', authRouter);

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

var server = http.Server(app);
mongoose.connect(config.DATABASE_URL)

var getBookApi = function(searchTerm) {
    console.log(searchTerm);
    var emitter = new events.EventEmitter();
    var key = 'AIzaSyDiIDDnvki5T6i83J2pS-m2VsnjhINjF5E'
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

app.get('/populate-cart', passport.authenticate('jwt', {session: false}), function(req, res) {
    Book.find({username:req.user.username}, function(err, book) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(book);
    });
});

app.post('/add-to-cart', passport.authenticate('jwt', {session: false}),  function(req, res) {
    var requiredFields = ['name', 'link', 'description', 'image'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = 'Missing `' + field + '` in request body';
            console.error(message);
            return res.status(400).send(message);
        }
    }
    console.log(req.user);

    Book.create({
            name: req.body.name,
            link: req.body.link,
            idValue: req.body.idValue,
            description: req.body.description,
            image: req.body.image,
            username: req.user.username
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
    Comment.find(function(err, notes) {
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
            commentId: req.body.commentId,
            bookId: req.body.bookId
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


app.delete('/delete-comment', function(req, res) {
    console.log(req.body._id);

    Comment.find(function(err, notes) {
        if (err) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }
        Comment.remove({
                _id: req.body._id
            },
            function() {
                res.status(201).json(notes);
            });
    });
});

//proteced endpoints//

app.get(
    '/add-to-cart',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.redirect('/login');
        console.log('add to cart redirect');
    }
);



//logout//

app.get('/logout', function(req, res) {
    console.log('redirect');
    req.logout();
    res.redirect('/');
});

app.listen(process.env.PORT || 8080, () => console.log('Server is up & running a ok'))
