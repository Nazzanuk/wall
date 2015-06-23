var express = require('express');
var cors = require('cors');
var _ = require('underscore');
var request = require('request');
var http = require('http');
var app = express();
var bodyParser = require('body-parser')
var ObjectID = require('mongodb').ObjectID;
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var db;

// Connection URL
var url = 'mongodb://wall:wall@ds051990.mongolab.com:51990/wall';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, database) {
    db = database;
    assert.equal(null, err);
    console.log("Connected correctly to server");
    //insertDocuments(db, function(){console.log('hai')});

    //db.close();
});

app.get('/', function (req, res) {
    res.send('HELLO!');
});

app.get('/walls', function (req, res) {
    getWalls({}, {}, function (docs) {
        res.send(docs);
    });
});

app.get('/walls/name/:name', function (req, res) {
    getWalls(req.params, {}, function (docs) {
        res.send(docs);
    });
});

app.get('/walls/user/:user', function (req, res) {
    getWalls({users: {$in: [req.params.user]}}, {name: 1}, function (docs) {
        res.send(docs);
    });
});

app.get('/notes/wall/:wall', function (req, res) {
    getNotes(req.params, {}, function (docs) {
        res.send(docs);
    });
});

app.get('/notes/id/:id', function (req, res) {
    console.log(req.params);
    getNotes({_id: ObjectID(req.params.id)}, {}, function (docs) {
        res.send(docs);
    });
});

app.put('/notes/id/:id', function (req, res) {
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    //console.log(req.data);
    updateNote({_id: ObjectID(req.params.id)}, req.body, function (docs) {
        res.send(docs);
    });
});

app.post('/notes', function (req, res) {
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    //console.log(req.data);
    insertNote(req.body, function (docs) {
        res.send(docs);
    });
});

var getWalls = function (data, fields, callback) {
    var collection = db.collection('walls');

    collection.find(data, fields).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

var getNotes = function (data, fields, callback) {
    var collection = db.collection('notes');

    collection.find(data, fields).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

var updateNote = function (data, fields, callback) {
    var collection = db.collection('notes');

    collection.update(data, fields, {upsert: false}, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

var insertNote = function (fields, callback) {
    var collection = db.collection('notes');

    collection.insert(fields, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};


var server = app.listen(4000, function () {

    var host = server.address().address;
    //var port = server.address().port;
    var port = process.env.PORT || 8080;

    console.log('Example app listening at http://%s:%s', host, port);
});