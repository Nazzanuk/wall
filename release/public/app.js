var app = angular.module('app', []);

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}
(function () {
    app.service('API', ['$rootScope', "$http", function ($rootScope, $http) {
        var that = this;

        var API_URL = "http://localhost:4000";

        var loadWallList = function (email) {
            return $http.get(API_URL + "/walls/user/" + email);
        };

        var loadWall = function (name) {
            return $http.get(API_URL + "/walls/name/" + name);
        };

        var loadNotes = function (wall) {
            return $http.get(API_URL + "/notes/wall/" + wall);
        };

        var updateNote = function (note) {
            var id = note._id;
            var noteClone = _.clone(note);
            delete noteClone._id;
            return $http.put(API_URL + "/notes/id/" + id, noteClone);
        };

        var newNote = function (note) {
            return $http.post(API_URL + "/notes/", note);
        };

        //var saveNote = function (note) {
        //    return $http.post(API_URL + "/notes/", {});
        //};

        that.updateNote = updateNote;
        that.newNote = newNote;
        //that.saveNote = saveNote;
        that.loadNotes = loadNotes;
        that.loadWallList = loadWallList;
        that.loadWall = loadWall;
        return that;

    }]);
}());
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
(function () {
    app.service('GoogleAuth', ['$rootScope', function ($rootScope) {

        window.GoogleAuth = this;
        var that = this;

        var signedIn = false;
        var profile;

        that.onSignIn = function (googleUser) {
            signedIn = true;

            // Useful data for your client-side scripts:
            profile = googleUser.getBasicProfile();
            //console.log("ID: " + profile.getId()); // Don't send this directly to your server!
            //console.log("Name: " + profile.getName());
            //console.log("Image URL: " + profile.getImageUrl());
            //console.log("Email: " + profile.getEmail());

            //console.table(profile);

            // The ID token you need to pass to your backend:
            var id_token = googleUser.getAuthResponse().id_token;
            //console.log("ID Token: " + id_token);
            $rootScope.$apply();
        };

        var getName = function () {
            if (!isSignedIn()) return;
            console.log(profile.getName());
            return profile.getName();
        };

        var getImageUrl = function () {
            if (!isSignedIn()) return;
            return profile.getImageUrl();
        };

        var getEmail = function () {
            if (!isSignedIn()) return;
            return profile.getEmail();
        };

        var isSignedIn = function () {
            return signedIn;
        };

        that.isSignedIn = isSignedIn;
        that.getName = getName;
        that.getImageUrl = getImageUrl;
        that.getEmail = getEmail;


        return that;

    }]);
}());

function onSignIn(user) {
    GoogleAuth.onSignIn(user);
}

(function () {
    app.controller('HeaderCtrl', ['$scope', 'GoogleAuth', 'Data', function ($scope, GoogleAuth, Data) {
        $scope.getName = GoogleAuth.getName;
        $scope.isSignedIn = GoogleAuth.isSignedIn;
        $scope.getImageUrl = GoogleAuth.getImageUrl;
    }]);
}());

(function () {
    app.controller('SidebarCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Data', function ($scope, $timeout, GoogleAuth, Data) {
        var events = function () {
            $(document).on('click','.header-burger', function () {
                $('.sidebar').velocity('stop').velocity('transition.slideLeftBigIn', {duration:300});
            });

            $(document).on('click','.sidebar-close', function () {
                $('.sidebar').velocity('stop').velocity('transition.slideLeftBigOut', {duration:300});
            });
        };

        var init = function () {
            events();
        };

        var setWall = function (wall) {
            $('.sidebar').velocity('stop').velocity('transition.slideLeftBigOut', {duration:300});
            Data.setWall(wall);
        };

        init();

        $scope.setWall = setWall;
        $scope.getWallList = Data.getWallList;
    }]);
}());

(function () {
    app.controller('WallCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Data', function ($scope, $timeout, GoogleAuth, Data) {

        $scope.notes = [];

        $scope.scale = 1;
        $scope.colour = 1;
        $scope.GoogleAuth = GoogleAuth;

        var changeScale = function (amount) {
            $scope.scale = $scope.scale * 1 + amount;
            localStorage.setItem('scale', $scope.scale);
            $('.wall-canvas')[0].style.zoom = $scope.scale;
            //console.log(document.body.style.zoom);
        };

        var changeFontSize = function (index, amount) {
            if (typeof (Data.getNotes()[index].fontSize) == 'undefined') {
                Data.getNotes()[index].fontSize = 12;
            }
            Data.getNotes()[index].fontSize = (Data.getNotes()[index].fontSize * 1) + amount;
            updateNote(index);
        };

        var reduceFontSize = function (index, amount) {
            if (typeof (Data.getNotes()[index].fontSize) == 'undefined') {
                Data.getNotes()[index].fontSize = 12;
            }
            Data.getNotes()[index].fontSize = (Data.getNotes()[index].fontSize * 1) - amount;
            updateNote(index);
        };

        var changeColour = function (index) {
            Data.getNotes()[index].colour++;
            if (Data.getNotes()[index].colour > 5) {
                Data.getNotes()[index].colour = 0;
            }
            updateNote(index);
        };

        var loadScale = function () {
            if (localStorage.getItem('scale') != undefined) {
                $scope.scale = localStorage.getItem('scale');
            }

            $('.wall-canvas')[0].style.zoom = $scope.scale;
            //console.log(document.body.style.zoom);
        };

        var events = function () {
            $scope.$watch(function () {
                return GoogleAuth.isSignedIn();
            }, function (isSignedIn) {
                console.log(isSignedIn);
                if (isSignedIn) {
                    console.log(GoogleAuth.getName());
                    $('.wall').velocity('transition.slideUpIn');
                    $('.g-signin2').velocity('transition.fadeOut');
                    start();
                }
            }, true);

            $scope.$watch(function () {
                return Data.getNotes();
            }, function (isSignedIn) {
                console.log(isSignedIn);
                if (isSignedIn) {
                    $timeout(function () {
                        setDraggable($(".note"));
                    }, 50);
                }
            }, true);
        };

        var start = function () {
            Data.setEmail(GoogleAuth.getEmail());
            Data.loadWallList().then(function (data) {
                console.log(data);
                Data.setWall(data[0].name);
            });

        };

        var updateNote = function (index) {
            Data.updateNote(Data.getNotes()[index]);
        };

        var newNote = function (index) {
            Data.newNote(Data.getNotes()[index]);
        };

        var addNote = function () {
            var note = {
                wall: Data.getWall(),
                top: 25055,
                left: 25055,
                fontSize: 12,
                colour: $scope.colour,
                content: "",
                angle: _.random(-3, 3)
            };

            Data.getNotes().push(note);
            var index = Data.getNotes().length - 1;

            $timeout(function () {

                setRandomAngle(index);
                setDraggable($element);
                $($element).velocity('stop').velocity('transition.fadeIn', {stagger: 100})
            }, 50);

            newNote(index);
        };

        var removeNote = function (index) {
            //delete Data.getNotes()[index];
            Data.getNotes()[index].wall = undefined;
            var $element = $("[note-id='" + index + "']");
            $($element).velocity('stop').velocity('transition.swoopOut');
            updateNote(index);
            //saveNotes();
        };

        var setRandomAngle = function (index) {
            //$scope.notes[index].angle =  _.random(-6, 6);
        };

        var setDraggable = function ($element) {

            //console.log($element);
            $scope.$apply();
            $element.draggable({
                cancel: ".note-header, .note-content, .note-close, .note-theme",
                stop: function (event, ui) {
                    //console.log(event, ui);
                    //console.log($('.wall-canvas').offset());
                    var id = $(event.target).attr("note-id");
                    console.log('Data.getNotes()[id]', Data.getNotes()[id]);
                    Data.getNotes()[id].top = Math.round((ui.offset.top - $('.wall-canvas').offset().top) / 20) * 20;
                    Data.getNotes()[id].left = Math.round((ui.offset.left - $('.wall-canvas').offset().left) / 20) * 20;
                    $scope.$apply();
                    $(event.target).show();
                    updateNote(id);
                }
            });
        };

        var init = function () {
            //loadScale()
            //loadNotes();
            events();

            $timeout(function () {
                //$('.wall').velocity('transition.slideUpIn');
                $('.wall-canvas').draggable({
                    cancel: ".note"
                });
                setDraggable($(".note"))
                $('.note').velocity('stop').velocity('transition.fadeIn', {stagger: 100});
                $('.wall-ui .ui-btn').velocity('stop').velocity('transition.fadeIn', {delay: 1000});
            }, 50);
        };

        init();

        //$scope.notes = notes;
        $scope.getNotes = Data.getNotes;
        $scope.getWall = Data.getWall;
        //$scope.saveNotes = saveNotes;
        $scope.updateNote = updateNote;
        $scope.addNote = addNote;
        $scope.removeNote = removeNote;
        $scope.changeScale = changeScale;
        $scope.changeColour = changeColour;
        $scope.changeFontSize = changeFontSize;
        $scope.reduceFontSize = reduceFontSize;
    }]);
}());
