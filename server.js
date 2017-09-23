/*express resources*/
//require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var http = require('http');
var Book = require('./models/book');
var Comment = require('./models/comment');
var passport = require('passport');
var {router: usersRouter} = require('./users');
var {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');


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

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/login/', authRouter);


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

//login//

//app.post('/login', function(req, res) {
//    var userName = req.body.userName;
//    var password = req.body.password;
//    console.log('post:', userName, password);
//    Users.findOne({
//        userName: userName,
//        password: password
//    }, function(err, users) {
//        if (err) {
//            return res.status(500).json({
//                message: 'Internal Server Error'
//            });
//        }
//        if (!users) {
//            return res.status(401).json({
//                message: 'Not found'
//            });
//        }
//        else {
//            console.log('validatePassword');
//            Users.schema.methods.validatePassword(password, function(err, isValid) {
//                console.log(err, isValid, 'hello');
//                if (err) {
//                    console.log(err);
//                }
//                if (!isValid) {
//                    return res.status(401).json({
//                        message: 'oops wrong password'
//                    });
//                }
//                else {
//                    console.log("User: " + userName + " logged in.");
//                    return res.json(users);
//                }
//
//            });
//        }
//    });
//});
//
////create new users//
//
//app.post('/users', function(req, res) {
//    console.log('made it');
//    var requiredFields = ['userName', 'password'];
//    for (var i = 0; i < requiredFields.length; i++) {
//        var field = requiredFields[i];
//        if (!(field in req.body)) {
//            var message = 'Missing `' + field + '` in request body';
//            console.error(message);
//            return res.status(400).send(message);
//        }
//    }
//
//    Users.create({
//        userName: req.body.userName,
//        password: req.body.password
//    }, function(err, user) {
//        if (err) {
//            return res.status(500).json({
//                message: err
//            });
//        }
//        res.status(201).json(user);
//    });
//
//});

app.get ('/users', function(req, res) {
    return res.status(400).json({
   message: 'hello users'
    });
});

app.get('/login', function (req, res) {
    return res.status(400).json({
        message: 'hello login'
    });
});

app.get(
    '/shelf',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        return res.json({
            data: 'rosebud'
        });
    }
);

//logout//

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(process.env.PORT || 8080, () => console.log('Server is up & running a ok'))
