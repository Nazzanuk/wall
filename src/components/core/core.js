(function () {
    app.service('Core', ['$rootScope', 'SendAPI', 'AnalyticsService', function ($rootScope, SendAPI, AnalyticsService) {
        var that = this;

        var wall = "";
        var wallList = [];
        var email = "";
        var notes = [];
        var users = [];

        var getWallUsers = function () {
            //console.log(users);
            return users;
        };

        var setWall = function (wallName) {
            //console.log('setWall', wallName);
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

        var sendFeedback = function (feedback) {
            SendAPI.sendFeedback(feedback, getEmail());
        };

        var getEmail = function () {
            return email;
        };

        var getWall = function () {
            return wall;
        };

        var addWall = function (wall) {
            SendAPI.addWall(wall);
            setWall(wall.name);
        };

        var addWallUser = function (email) {
            SendAPI.addWallUser(email, wall);
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
            if (data[0] == undefined) {
                notes = [];
            } else if (data[0].wall = wall) {
                notes = data;
            }
            $rootScope.$apply();
        };

        var receiveNote = function (data) {
            if (data[0].wall = wall) {
                var note = _.findWhere(notes, {_id :data[0]._id});
                if (note == undefined) {
                    notes.push(note);
                } else {
                    for (var i in data[0]) {
                        note[i] = data[0][i];
                    }
                }
            }
            $rootScope.$apply();
        };

        var receiveWallList = function (data) {
            wallList = data;
            $rootScope.$apply();
        };

        var receiveWallUsers = function (data) {
            users = data;
            $rootScope.$apply();
        };

        var requestWallList = function () {
            SendAPI.requestWallList(GoogleAuth.getEmail());
        };

        var requestWallUsers = function () {
            SendAPI.requestWallUsers(wall);
        };

        that.sendFeedback = sendFeedback;
        that.requestWallList = requestWallList;
        that.receiveWallList = receiveWallList;
        that.addWallUser = addWallUser;
        that.updateNote = updateNote;
        that.updateUser = updateUser;
        that.removeNote = removeNote;
        that.addNote = addNote;
        that.setWall = setWall;
        that.addWall = addWall;
        that.setEmail = setEmail;
        that.getEmail = getEmail;
        that.getWallUsers = getWallUsers;
        that.requestWallUsers = requestWallUsers;
        that.receiveWallUsers = receiveWallUsers;
        that.getWall = getWall;
        that.getWallList = getWallList;
        that.getNotes = getNotes;
        that.receiveNotes = receiveNotes;
        that.receiveNote = receiveNote;

        return that;
    }]);
}());