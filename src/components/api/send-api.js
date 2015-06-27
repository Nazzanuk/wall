(function () {
    app.service('SendAPI', ['$rootScope', "$http", function ($rootScope) {
        var that = this;

        var setWall = function (room) {
            socket.emit('join-room', room);
        };

        var updateNote = function (note) {
            socket.emit('update-note', note);
        };

        var updateUser = function (user) {
            socket.emit('update-user', user);
        };

        var addNote = function (note) {
            socket.emit('add-note', note);
        };

        var removeNote = function (note) {
            socket.emit('remove-note', note);
        };

        that.removeNote = removeNote;
        that.updateUser = updateUser;
        that.addNote = addNote;
        that.updateNote = updateNote;
        that.setWall = setWall;

        return that;
    }]);
}());