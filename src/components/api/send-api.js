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

        var addWallUser = function (email, wallName) {
            socket.emit('add-wall-user', {email: email, wallName: wallName});
        };

        var requestWallList = function (email) {
            socket.emit('request-wall-list', email);
        };

        var requestWallUsers = function (wallName) {
            socket.emit('request-wall-users', wallName);
        };

        var addWall = function (wall) {
            socket.emit('add-wall', wall);
        };

        var removeNote = function (note) {
            socket.emit('remove-note', note);
        };

        that.requestWallUsers = requestWallUsers;
        that.addWallUser = addWallUser;
        that.removeNote = removeNote;
        that.updateUser = updateUser;
        that.addNote = addNote;
        that.addWall = addWall;
        that.updateNote = updateNote;
        that.setWall = setWall;
        that.requestWallList = requestWallList;

        return that;
    }]);
}());