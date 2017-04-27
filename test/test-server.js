global.DATABASE_URL = 'mongodb://admin:password@ds157980.mlab.com:57980/final-capstone';

var chai = require('chai');
var chaiHttp = require('chai-http');

var should = chai.should();

var server = require('../server');
var runServer = require("../server")
var bookItem = require('../models/book');
var app = server.app;

chai.use(chaiHttp);

describe('Book Search', function() {

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/book/:searchTerm')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.items.should.have.length(12);
            });
        done();
    });

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/populate-cart')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
            });
        done();
    });


    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/add-to-cart')
            .send({
                'idValue': 'wcgw',
                'link': 'https://en.wikipedia.org/wiki/Dune_(novel)',
                'name': 'Dune'
            })
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('idValue');
                res.body.should.have.property('link');
                res.body.should.have.property('name');
                res.body.idValue.should.be.a('string');
                res.body.link.should.be.a('string');
                res.body.name.should.be.a('string');
            });
        done();
    });

    it('should remove an item on DELETE', function(done) {
        chai.request(app)
            .get('/add-to-cart')
            .end(function(err, res) {
                chai.request(app)
                    .delete('/delete-cart')
                    .end(function(err, res) {
                        should.equal(err, res);
                        res.should.have.status(201);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('idValue');
                        res.body.should.have.property('link');
                        res.body.should.have.property('name');
                    });
            });
        done();
    });
});
