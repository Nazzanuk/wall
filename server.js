var express = require('express');
var cors = require('cors');
var _ = require('underscore');
var request = require('request');
//var http = require('http');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var ObjectID = require('mongodb').ObjectID;
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('join-room', function(room){
        console.log('join-room', room);
        socket.join(room);
        getNotes({wall: room}, {}, function (docs) {
            io.to(room).emit('notes', docs);
        });
    });

    socket.on('update-note', function(note){
        console.log('update-note', note);
        var room = note.wall;
        var id = note._id;
        delete note._id;

        updateNote({_id: ObjectID(id)}, note, function (docs) {
            console.log('updated?',docs.result);
            getNotes({wall: room}, {}, function (docs) {
                socket.broadcast.to(room).emit('notes', docs);
            });
        });
    });

    socket.on('add-note', function(note){
        console.log('add-note', note);
        var room = note.wall;

        insertNote(note, function (docs) {
            console.log(docs.result);
            getNotes({wall: room}, {}, function (docs) {
                io.to(room).emit('notes', docs);
            });
        });
    });

    socket.on('remove-note', function(note){
        console.log('remove-note', note);
        var room = note.wall;

        removeNote({_id: ObjectID(note._id)}, function (docs) {
            console.log(docs.result);
            getNotes({wall: room}, {}, function (docs) {
                io.to(room).emit('notes', docs);
            });
        });
    });

    socket.on('update-user', function(user){
        console.log('update-user', user);

        updateUser({_id: user.email}, user, function (docs) {
            console.log(docs.result);
            getWalls({users: {$in: [user.email]}}, {name: 1}, function (docs) {
                socket.emit('wall-list', docs);
            });
        });
    });
});

io.on('disconnect', function(){
    console.log('user disconnected');
});

var port = process.env.PORT || 4000;
http.listen(port, function(){
    console.log('listening on *:' + port);
});

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

var updateWall = function (data, fields, callback) {
    var collection = db.collection('walls');

    collection.update(data, fields, {upsert: true}, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

var updateUser = function (data, fields, callback) {
    var collection = db.collection('users');

    collection.update(data, fields, {upsert: true}, function (err, docs) {
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

var removeNote = function (data, callback) {
    var collection = db.collection('notes');

    collection.remove(data, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};


//var port = process.env.PORT || 4000;
//
//var server = app.listen(port, function () {
//
//    var host = server.address().address;
//    //var port = server.address().port;
//
//    console.log('Example app listening at http://%s:%s', host, port);
//});