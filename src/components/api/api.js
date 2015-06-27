(function () {
    app.service('API', ['$rootScope', "$http", function ($rootScope, $http) {
        //var that = this;
        //
        //var API_URL = "http://localhost:4000";
        ////var API_URL = "https://nameless-beyond-9248.herokuapp.com";
        //
        //var loadWallList = function (email) {
        //    return $http.get(API_URL + "/walls/user/" + email);
        //};
        //
        //var loadWall = function (name) {
        //    return $http.get(API_URL + "/walls/name/" + name);
        //};
        //
        //var loadNotes = function (wall) {
        //    return $http.get(API_URL + "/notes/wall/" + wall);
        //};
        //
        //var updateNote = function (note) {
        //    var id = note._id;
        //    var noteClone = _.clone(note);
        //    delete noteClone._id;
        //    return $http.put(API_URL + "/notes/id/" + id, noteClone);
        //};
        //
        //var updateUser = function (user) {
        //    return $http.put(API_URL + "/users/", user);
        //};
        //
        //var updateWall = function (wall) {
        //    return $http.put(API_URL + "/walls/", wall);
        //};
        //
        //var newNote = function (note) {
        //    return $http.post(API_URL + "/notes/", note);
        //};
        //
        ////var saveNote = function (note) {
        ////    return $http.post(API_URL + "/notes/", {});
        ////};
        //
        //that.updateWall = updateWall;
        //that.updateNote = updateNote;
        //that.updateUser = updateUser;
        //that.newNote = newNote;
        ////that.saveNote = saveNote;
        //that.loadNotes = loadNotes;
        //that.loadWallList = loadWallList;
        //that.loadWall = loadWall;
        //return that;

    }]);
}());