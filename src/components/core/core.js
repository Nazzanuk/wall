(function () {
    app.service('Core', ['$rootScope', 'SendAPI', function ($rootScope, SendAPI) {
        var that = this;

        var wall = "";
        var wallList = [];
        var email = "";
        var notes = [];

        var setWall = function (wallName) {
            console.log('setWall', wallName);
            wall = wallName;
            SendAPI.setWall(wallName);
        };

        var updateUser = function () {
            SendAPI.updateUser(GoogleAuth.getUser());
        };

        var setEmail = function (emailName) {
            console.log('setEmail', emailName);
            email = emailName;
        };

        var getEmail = function () {
            return email;
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

        var updateNote = function (note) {
            SendAPI.updateNote(note);
        };

        var addNote = function (note) {
            SendAPI.addNote(note);
        };

        var removeNote = function (note) {
            SendAPI.removeNote(note);
        };

        var receiveNotes = function (data) {
            if (data[0].wall = wall) {
                notes = data;
            }
            $rootScope.$apply();
        };

        var receiveWallList = function (data) {
            wallList = data;
            $rootScope.$apply();
        };

        that.receiveWallList = receiveWallList;
        that.updateNote = updateNote;
        that.updateUser = updateUser;
        that.removeNote = removeNote;
        that.addNote = addNote;
        that.setWall = setWall;
        that.setEmail = setEmail;
        that.getEmail = getEmail;
        that.getWall = getWall;
        that.getWallList = getWallList;
        that.getNotes = getNotes;
        that.receiveNotes = receiveNotes;

        return that;
    }]);
}());