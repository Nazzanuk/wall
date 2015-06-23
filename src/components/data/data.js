(function () {
    app.service('Data', ['$rootScope', "API", "GoogleAuth", function ($rootScope, API, GoogleAuth) {
        var that = this;

        var user = "";
        var wall = "";
        var wallList = [];
        var settings = {};
        var notes = [];

        var setEmail = function (email) {
            user = email;
        };

        var setWall = function (name) {
            wall = name;
            return loadNotes();
        };

        var getWall = function () {
            return wall;
        };

        var getWallList = function () {
            return wallList;
        };

        var getNotes = function () {
            return notes;
        };

        var loadWallList = function () {
            return API.loadWallList(user).then(function (response) {
                wallList = response.data;
                return wallList;
                console.log(wallList);
            });
        };

        var loadNotes = function () {
            return API.loadNotes(wall).then(function (response) {
                console.log(response.data);
                notes = response.data;
                console.log(notes);
            });
        };

        var updateNote = function (note) {
            return API.updateNote(note).then(function () {
                return loadNotes();
            });
        };

        var newNote = function (note) {
            return API.newNote(note).then(function () {
                return loadNotes();
            });
        };

        that.updateNote = updateNote;
        that.newNote = newNote;
        that.setEmail = setEmail;
        that.setWall = setWall;
        that.getWall = getWall;
        that.getWallList = getWallList;
        that.loadWallList = loadWallList;
        that.getNotes = getNotes;
        that.loadNotes = loadNotes;
        return that;

    }]);
}());