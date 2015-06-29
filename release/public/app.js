var app = angular.module('app', []);

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
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

var currentMousePos = {left: -1, top: -1};
$(document).mousemove(function (event) {
    currentMousePos.left = event.pageX;
    currentMousePos.top = event.pageY;
});

var socket = io('http://localhost:4000');
//var socket = io('https://nameless-beyond-9248.herokuapp.com');
socket.on('connect', function () {
    console.log('connected!')
});
socket.on('disconnect', function () {
});
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
(function () {
    app.service('ReceiveAPI', ["Core", function (Core) {
        var that = this;

        var events = function () {
            //socket.on('note', function(data){
            //    Data.receiveNote(data)
            //});

            socket.on('notes', function(data){
                notes(data);
            });

            socket.on('test', function(data){
                console.log('test', data)
            });

            socket.on('wall-list', function(data){
                wallList(data);
            });

            socket.on('wall-users', function(data){
                wallUsers(data);
            });
        };

        var notes = function (data) {
            Core.receiveNotes(data);
        };

        var wallList = function (data) {
            console.log('wall-list', data);
            Core.receiveWallList(data);
        };

        var wallUsers = function (data) {
            console.log('wall-users', data);
            Core.receiveWallUsers(data);
        };

        var init = function () {
            events();
        };

        init();

        that.notes = notes;

        return that;
    }]);
}());
(function () {
    app.service('SendAPI', ['$rootScope', "$http", function ($rootScope) {
        var that = this;

        var setWall = function (room) {
            socket.emit('join-room', room);
        };

        var updateNote = function (note) {
            try {
                delete note.$$hashKey;
            } catch (e) {
                console.log(e);
            }
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
(function () {
    app.service('Core', ['$rootScope', 'SendAPI', function ($rootScope, SendAPI) {
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

        return that;
    }]);
}());
(function () {
    app.service('Data', ['$rootScope', "API", "GoogleAuth", function ($rootScope, API, GoogleAuth) {
        //var that = this;
        //
        //var user = "";
        //var wall = "";
        //var wallList = [];
        //var settings = {};
        //var notes = [];
        //
        //var setEmail = function (email) {
        //    user = email;
        //};
        //
        //var setWall = function (name) {
        //    wall = name;
        //    return loadNotes();
        //};
        //
        //var getWall = function () {
        //    return wall;
        //};
        //
        //var getWallList = function () {
        //    return wallList;
        //};
        //
        //var getNotes = function () {
        //    return notes;
        //};
        //
        //var loadWallList = function () {
        //    return API.loadWallList(user).then(function (response) {
        //
        //
        //        //var z = _.clone(response.data);
        //        //z.push({name:'global'});
        //        ////console.log(z);
        //        wallList = response.data;
        //        //return z;
        //        return wallList;
        //    });
        //};
        //
        //var loadNotes = function () {
        //    return API.loadNotes(wall).then(function (response) {
        //        //console.log(response.data);
        //        notes = response.data;
        //        //console.log(notes);
        //    });
        //};
        //
        //var updateNote = function (note) {
        //    return API.updateNote(note).then(function () {
        //        //return loadNotes();
        //    });
        //};
        //
        //var updateUser = function () {
        //    return API.updateUser(GoogleAuth.getUser()).then(function () {
        //        //return loadNotes();
        //    });
        //};
        //
        //var updateWall = function (wall) {
        //    return API.updateWall(wall).then(function () {
        //        //return loadNotes();
        //    });
        //};
        //
        //var newNote = function (note) {
        //    return API.newNote(note).then(function () {
        //        return loadNotes();
        //    });
        //};
        //
        //that.updateWall = updateWall;
        //that.updateNote = updateNote;
        //that.updateUser = updateUser;
        //that.newNote = newNote;
        //that.setEmail = setEmail;
        //that.setWall = setWall;
        //that.getWall = getWall;
        //that.getWallList = getWallList;
        //that.loadWallList = loadWallList;
        //that.getNotes = getNotes;
        //that.loadNotes = loadNotes;
        //return that;

    }]);
}());
(function () {
    app.service('GoogleAuth', ['$rootScope', function ($rootScope) {

        window.GoogleAuth = this;
        var that = this;

        var signedIn = false;
        var profile;
        var id_token;

        that.onSignIn = function (googleUser) {
            signedIn = true;

            // Useful data for your client-side scripts:
            profile = googleUser.getBasicProfile();
            //console.log("ID: " + profile.getId()); // Don't send this directly to your server!
            //console.log("Name: " + profile.getName());
            //console.log("Image URL: " + profile.getImageUrl());
            //console.log("Email: " + profile.getEmail());

            //console.table(profile);
            console.log(profile);

            // The ID token you need to pass to your backend:
            id_token = googleUser.getAuthResponse().id_token;
            //console.log("ID Token: " + id_token);
            $rootScope.$apply();
        };

        var getName = function () {
            if (!isSignedIn()) return;
            //console.log(profile.getName());
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

        var getUser = function () {
            var user = {
                email : getEmail(),
                name: getName(),
                image: getImageUrl(),
                id_token:id_token
            };

            return user;
        };

        var isSignedIn = function () {
            return signedIn;
        };

        that.isSignedIn = isSignedIn;
        that.getUser = getUser;
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
    app.controller('MiniMapCtrl', ['$scope', 'Core', function ($scope, Core) {

        $scope.screen = {
            width: 10,
            height: 10
        };

        var scale = 40;

        var setScreenHeight = function () {
            $scope.screen.height = $(window).height() / scale;
            $scope.screen.width = $(window).width() / scale;
            $scope.screen.top = ($('.wall-canvas').position().top) / (scale * -1);
            $scope.screen.left = ($('.wall-canvas').position().left) / (scale * -1);

            //console.log($scope.screen);
            $scope.$apply();

        };

        var scalePosition = function (number) {
            return (number / scale);
        };

        var events = function () {
            $(document).on('mousemove', function () {
                //console.log('mousemoved');
                setScreenHeight();
            });
        };

        var init = function () {
            events();
        };

        init();

        $scope.getNotes = Core.getNotes;
        $scope.scalePosition = scalePosition;
    }]);
}());

(function () {
    app.controller('Core', ['$scope', function ($scope) {

    }]);
}());
(function () {
    app.controller('SidebarCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Core', function ($scope, $timeout, GoogleAuth, Core) {

        $scope.addWallName = "";

        var events = function () {
            $(document).on('click','.header-burger', function () {
                $('.sidebar').velocity('stop').velocity('transition.slideLeftBigIn', {duration:300});
                Core.requestWallList()
            });

            $(document).on('click','.sidebar-close', function () {
                hideSidebar();
            });

            $(document).on('click','.add-wall', function () {
                $('.add-wall-popup').velocity('stop').velocity('transition.flipYIn', {duration:300});
                hideSidebar();
            });

            $(document).on('click','.close-wall-popup', function () {
                closeWallPopup();
            });
        };

        var closeWallPopup = function () {
            $('.add-wall-popup').velocity('stop').velocity('transition.flipYOut', {duration:300});
        };

        var hideSidebar = function () {
            $('.sidebar').velocity('stop').velocity('transition.slideLeftBigOut', {duration: 300});
        };

        var init = function () {
            events();
        };

        var setWall = function (wall) {
            $('.sidebar').velocity('stop').velocity('transition.slideLeftBigOut', {duration:300});
            Core.setWall(wall);
        };

        var setMyWall = function () {
            setWall(GoogleAuth.getEmail());
        };

        var validateName = function () {
            var flag = true;

            flag = flag && $scope.addWallName != "";
            flag = flag && $scope.addWallName.indexOf(" ") == -1;

            return flag;
        };

        var addWall = function () {
            if (!validateName()) return;
            closeWallPopup();
            var wallName = $scope.addWallName.toLowerCase();
            Core.addWall({name:wallName, users:[GoogleAuth.getEmail()]});
        };

        init();

        $scope.addWall = addWall;
        $scope.setWall = setWall;
        $scope.setMyWall = setMyWall;
        $scope.getWallList = Core.getWallList;
    }]);
}());

(function () {
    app.controller('UsersPopupCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Core', function ($scope, $timeout, GoogleAuth, Core) {

        $scope.userEmail = "example@gmail.com";

        var events = function () {

            $(document).on('click','.ui-users-btn', function () {
                openUsersPopup();
            });

            $(document).on('click','.close-users-popup', function () {
                closeUsersPopup();
            });
        };

        var openUsersPopup = function () {
            $('.users-popup').velocity('stop').velocity('transition.flipYIn', {duration:300});
            Core.requestWallUsers();
        };

        var closeUsersPopup = function () {
            $('.users-popup').velocity('stop').velocity('transition.flipYOut', {duration:300});
        };

        var addWallUser = function () {
            Core.addWallUser($scope.userEmail);
        };

        var init = function () {
            events();
        };

        init();

        $scope.addWallUser = addWallUser;
        $scope.getWallUsers = Core.getWallUsers;
        $scope.requestWallUsers = Core.requestWallUsers;
    }]);
}());

(function () {
    app.controller('WallCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Core', 'ReceiveAPI', function ($scope, $timeout, GoogleAuth, Core, ReceiveAPI) {

        $scope.notes = [];
        $scope.scale = 1;
        $scope.colour = 1;
        $scope.GoogleAuth = GoogleAuth;
        $scope.defaultIcon = 0;
        $scope.icons = [
            'long-arrow-right',
            'arrows-h',
            'chevron-right',
            'arrow-right',
            'angle-right',
            'hand-o-right',
            'check',
            'times',
            'plus',
            'minus',
            'question',
            'pencil',
            'search',
            'star',
            'file',
            'comment',
            'asterisk',
            'user',
            'users',
            'lock',
            'unlock'
        ];

        var changeIcon = function (index) {
            getNote(index).icon = getNote(index).icon * 1 + 1;
            if (getNote(index).icon == $scope.icons.length) {
                getNote(index).icon = 0;
            }
            $scope.defaultIcon = getNote(index).icon;
            updateNote(index);
        };

        var changeIconAngle = function (index) {
            getNote(index).iconAngle = getNote(index).iconAngle * 1 + 90;
            updateNote(index);
        };

        var changeScale = function (amount) {
            $scope.scale = $scope.scale * 1 + amount;
            $('.wall-zoom')[0].style.zoom = $scope.scale;
        };

        var reduceScale = function (amount) {
            $scope.scale = $scope.scale * 1 - amount;
            $('.wall-zoom')[0].style.zoom = $scope.scale;
        };

        var getNote = function (index) {
            return getNotes()[index];
        };

        var getNotes = function () {
            return Core.getNotes();
        };

        var getWall = function () {
            return Core.getWall();
        };

        var changeFontSize = function (index, amount) {
            var note = getNote(index);
            note.fontSize = note.fontSize == undefined ? 16 :  note.fontSize;
            note.fontSize = parseInt(note.fontSize) + amount;
            updateNote(index);
        };

        var reduceFontSize = function (index, amount) {
            var note = getNote(index);
            note.fontSize = note.fontSize == undefined ? 16 :  note.fontSize;
            note.fontSize = parseInt(note.fontSize) - amount;
            updateNote(index);
        };

        var changeColour = function (index) {
            getNote(index).colour++;
            if (getNote(index).colour > 5) {
                getNote(index).colour = 0;
            }
            updateNote(index);
        };

        var events = function () {
            $scope.$watch(function () {
                return GoogleAuth.isSignedIn();
            }, function (isSignedIn) {
                //console.log(isSignedIn);
                if (isSignedIn) {
                    //console.log(GoogleAuth.getName());
                    $('.wall').velocity('transition.slideUpIn');
                    $('.g-signin2').velocity('transition.fadeOut');
                    start();
                }
            }, true);

            $scope.$watch(function () {
                return getNotes();
            }, function (isSignedIn) {
                //console.log(isSignedIn);
                if (isSignedIn) {
                    $timeout(function () {
                        setDraggable($(".note"));
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 50);
                }
            }, true);
        };


        var start = function () {
            Core.setEmail(GoogleAuth.getEmail());
            Core.updateUser();
            Core.setWall('global');
        };

        var updateNote = function (index) {
            Core.updateNote(getNote(index));
        };

        var addNote = function (type, modifier) {
            if (modifier == undefined) {
                modifier = {};
                modifier.top = 75;
                modifier.left = 95;
            }

            var position = $('.wall-canvas').position();

            var note = {
                wall: getWall(),
                top: position.top * -1 + modifier.top - 40,
                left: position.left * -1 + modifier.left,
                colour: $scope.colour,
                content: "",
                angle: _.random(-3, 3),
                fontSize:16,
                icon: $scope.defaultIcon,
                type: type
            };

            if (type == "icon") {
                note.fontSize = 50;
                note.iconAngle = 0;
                note.angle = 0;
            }

            Core.addNote(note);
        };

        var removeNote = function (index) {
            Core.removeNote(getNote(index));
        };

        var setDraggable = function ($element) {
            //console.log($element);
            $scope.$apply();
            $element.draggable({
                cancel: ".note-header, .note-content, .note-close, .note-theme",
                drag: function (event, ui) {
                    var id = $(event.target).attr("note-id");
                    getNote(id).top = ui.offset.top - $('.wall-canvas').offset().top;
                    getNote(id).left = ui.offset.left - $('.wall-canvas').offset().left;
                    updateNote(id);
                },
                stop: function (event, ui) {
                    var id = $(event.target).attr("note-id");
                    getNote(id).top = Math.round((ui.offset.top - $('.wall-canvas').offset().top) / 20) * 20;
                    getNote(id).left = Math.round((ui.offset.left - $('.wall-canvas').offset().left) / 20) * 20;
                    updateNote(id);
                }
            });
        };

        var shortcuts = function () {
            $(document).on('keydown', function (e) {
                if (e.ctrlKey) {
                    switch (e.keyCode) {
                        case 78:
                            addNote('note', currentMousePos);
                            break;
                        case 73:
                            addNote('icon', currentMousePos);
                            break;
                    }
                }
                console.log(e);
            });
        };

        var init = function () {
            $('[data-toggle="tooltip"]').tooltip();
            events();
            shortcuts();

            $timeout(function () {
                //$('.wall').velocity('transition.slideUpIn');
                $('.wall-canvas').draggable({
                    cancel: ".note"
                });
                setDraggable($(".note"));
                $('.wall-ui .ui-btn').velocity('stop').velocity('transition.fadeIn', {delay: 1000});
            }, 50);
        };

        init();

        $scope.getNotes = getNotes;
        $scope.getWall = getWall;
        $scope.updateNote = updateNote;
        $scope.changeIconAngle = changeIconAngle;
        $scope.changeIcon = changeIcon;
        $scope.addNote = addNote;
        $scope.removeNote = removeNote;
        $scope.changeScale = changeScale;
        $scope.reduceScale = reduceScale;
        $scope.changeColour = changeColour;
        $scope.changeFontSize = changeFontSize;
        $scope.reduceFontSize = reduceFontSize;
    }]);
}());
