/*express resources*/
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var http = require('http');
var Users = require('./models/...');
var Movie = require('./models/...');

/*api resources*/
var unirest = require('unirest');
var events = require('events');

/*db resources*/
var mongoose = require('mongoose');
var config = require('./config');
