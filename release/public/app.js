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

//var socket = io('http://localhost:4000');
var socket = io('https://nameless-beyond-9248.herokuapp.com');
socket.on('connect', function () {
    console.log('connected!')
});
socket.on('disconnect', function () {
});
app.service('AnalyticsService', [function () {

    var GAEvents = [
        ['.add-note', 'UI Interaction', 'Add Note'],
        ['.header-new-wall', 'UI Interaction', 'New Wall (Header)'],
        ['.add-icon', 'UI Interaction', 'Add Icon'],
        ['.ui-users-btn', 'UI Interaction', 'Add / Remove Collaborators'],
        ['.share-btn', 'UI Interaction', 'Share WLL.space'],
        ['.ui-feedback-btn', 'UI Interaction', 'Give Us Feedback!'],
        ['.settings-btn', 'UI Interaction', 'Settings'],
        ['.header-burger', 'Note Interaction', 'Open Sidebar'],
        ['.note-change-theme', 'Note Interaction', 'Change Theme'],
        ['.note-change-icon', 'Note Interaction', 'Change Icon'],
        ['.note-rotate-icon', 'Note Interaction', 'Rotate Icon'],
        ['.note-change-size', 'Note Interaction', 'Change Font Size'],
        ['.note-close', 'Note Interaction', 'Remove Note']
    ];

    for (var i in GAEvents) {
        setGAAnalyticsEvent(GAEvents[i]);
    }

    function setGAAnalyticsEvent(array) {
        $(document).on('click', array[0], function () {
            console.log(array);
            //_trackEvent(array[1], array[2]);
            //_gaq.push(['_trackEvent', array[1], array[2]]);
            ga('send', 'event', array[1], array[2]);
        });
    }

    console.log(GAEvents);
}]);



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

            socket.on('note', function(data){
                note(data);
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

        var note = function (data) {
            Core.receiveNote(data);
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

        var sendFeedback = function (feedback, email) {
            socket.emit('send-feedback', {feedback: feedback, email: email});
        };

        that.sendFeedback = sendFeedback;
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
            if (wall == getEmail()) {
                return "my-wall";
            }
            return wall;
        };

        var getRealWall = function () {
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
        that.getRealWall = getRealWall;
        that.getWallList = getWallList;
        that.getNotes = getNotes;
        that.receiveNotes = receiveNotes;
        that.receiveNote = receiveNote;

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
    app.service('Email', ['Core', 'GoogleAuth', '$http', function (Core, GoogleAuth, $http) {
        var that = this;

        var baseEmail = {
            "key": "aFC8zfGEpNgr0iUd5sRF1Q",
            "message": {
                "html": "<p>Example HTML content</p>",
                "subject": "example subject",
                "from_email": "info@wll.space",
                "from_name": "WLL.space",
                "to": [
                    {
                        "email": "nazzanuk@gmail.com"
                    }
                ]
            }
        };

        var sendCollaborationInvite = function (email) {
            var obj = _.clone(baseEmail);

            obj.message.html = '<style>a{color:#51c7f1;font-weight:bold;}</style>' +
            '<a href="http://wll.space"><img style="width:300px;height:auto;" src="https://gallery.mailchimp.com/cef6196e11327b192c5c4baac/images/787a7310-446e-4f7e-8b8d-e49a0600f5c5.png" alt="WLL.space"/></a><br/><br/>' +
            '<h2>You have been invited to collaborate on WLL.space!</h2>' +
            '<p>' + GoogleAuth.getName() + ' has invited you to start collaborating on ' +
            '<a href="http://app.wll.space/#' + Core.getWall() + '">#' + Core.getWall() + '</a></p>' +
            '<p><a href="http://app.wll.space/#' + Core.getWall() + '">Start collaborating on #' + Core.getWall() + ' now!</a></p>';

            obj.message.subject = "You have received an invitation to WLL.space";
            obj.message.to = [{"email": email}];

            $http.post('https://mandrillapp.com/api/1.0/messages/send.json', obj)
                .success(function (data, status, headers, config) {
                    console.log('email sent', data);
                }).error(function (data, status, headers, config) {
                    console.log('email not sent', data);
                });
        };

        that.sendCollaborationInvite = sendCollaborationInvite;

    }]);
}());

(function () {
    app.controller('FeedbackPopupCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Core', function ($scope, $timeout, GoogleAuth, Core) {

        $scope.feedback = "";

        var events = function () {

            $(document).on('click','.ui-feedback-btn', function () {
                openFeedbackPopup();
            });

            $(document).on('click','.close-feedback-popup', function () {
                closeFeedbackPopup();
            });
        };

        var openFeedbackPopup = function () {
            $('.feedback-popup').velocity('stop').velocity('transition.flipYIn', {duration:300});
        };

        var closeFeedbackPopup = function () {
            $('.feedback-popup').velocity('stop').velocity('transition.flipYOut', {duration:300});
        };

        var sendFeedback = function () {
            Core.sendFeedback($scope.feedback);
            closeFeedbackPopup();
            ga('send', 'event', 'Feedback', 'Provided Feedback');
        };

        var init = function () {
            events();

            $timeout(function () {
                $('.ui-feedback-btn').velocity('stop').velocity('callout.shake');
            },10000);
        };

        init();

        $scope.sendFeedback = sendFeedback;
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
            ga('send', 'event', 'User', profile.getEmail() + ' signed In');
            ga('send', 'event', 'User', 'User Signed In');
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
    app.controller('HeaderCtrl', ['$scope', 'GoogleAuth', 'Core', function ($scope, GoogleAuth, Core) {
        $scope.getName = GoogleAuth.getName;
        $scope.getWall = Core.getWall;
        $scope.isSignedIn = GoogleAuth.isSignedIn;
        $scope.getImageUrl = GoogleAuth.getImageUrl;
    }]);
}());

(function () {
    app.controller('Core', ['$scope', function ($scope) {

    }]);
}());
(function () {
    app.controller('MiniMapCtrl', ['$scope', 'Core', 'GoogleAuth', function ($scope, Core, GoogleAuth) {

        $scope.screen = {
            width: 10,
            height: 10
        };

        $scope.$watch(function () { return GoogleAuth.isSignedIn()}, function (newVal) {
            if (GoogleAuth.isSignedIn()) {
                $('.mini-map').velocity('transition.fadeIn');
            }
        });

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
        $scope.isSignedIn = GoogleAuth.isSignedIn;
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

            $(document).on('click','.add-wall, .header-new-wall', function () {
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
            window.location.href = '#' + wall;
            Core.setWall(wall);
            ga('send', 'event', 'Set Wall', '#' + wall);
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
            ga('send', 'event', 'New Wall', 'New Wall');
        };

        init();

        $scope.addWall = addWall;
        $scope.setWall = setWall;
        $scope.setMyWall = setMyWall;
        $scope.getWallList = Core.getWallList;
    }]);
}());

(function () {
    app.controller('UsersPopupCtrl', ['$scope', 'Email', '$timeout', 'GoogleAuth', 'Core', function ($scope, Email, $timeout, GoogleAuth, Core) {

        $scope.userEmail = "";

        var events = function () {

            $(document).on('click', '.ui-users-btn', function () {
                openUsersPopup();
            });

            $(document).on('click', '.close-users-popup', function () {
                closeUsersPopup();
            });
        };

        var openUsersPopup = function () {
            $('.users-popup').velocity('stop').velocity('transition.flipYIn', {duration: 300});
            Core.requestWallUsers();
        };

        var closeUsersPopup = function () {
            $('.users-popup').velocity('stop').velocity('transition.flipYOut', {duration: 300});
        };

        var addWallUser = function () {
            Core.addWallUser($scope.userEmail);
            Email.sendCollaborationInvite($scope.userEmail);
            closeUsersPopup();
            ga('send', 'event', 'Collaborator', 'Added Collaborator');
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
        //$scope.colour = 1;
        $scope.GoogleAuth = GoogleAuth;
        $scope.defaultIcon = 0;
        $scope.defaultTheme = 1;
        $scope.defaultFontSize = 16;
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

        //$scope.fix = function () {
        //    for (var i in getNotes()) {
        //        console.log(getNote(i).top)
        //        if (getNote(i).top > 5000) {
        //            getNote(i).top = getNote(i).top - 22500;
        //            getNote(i).left = getNote(i).left - 22500;
        //            updateNote(i);
        //        }
        //    }
        //};

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
            $scope.defaultFontSize = note.fontSize;
        };

        var reduceFontSize = function (index, amount) {
            var note = getNote(index);
            note.fontSize = note.fontSize == undefined ? 16 :  note.fontSize;
            note.fontSize = parseInt(note.fontSize) - amount;
            updateNote(index);
            $scope.defaultFontSize = note.fontSize;
        };

        var changeColour = function (index) {
            getNote(index).colour++;
            if (getNote(index).colour > 5) {
                getNote(index).colour = 0;
            }
            $scope.defaultTheme = getNote(index).colour;
            updateNote(index);
        };

        var events = function () {
            $scope.$watch(function () {
                return GoogleAuth.isSignedIn();
            }, function (isSignedIn) {
                //console.log(isSignedIn);
                if (isSignedIn) {
                    //console.log(GoogleAuth.getName());
                    $('[data-template="header"] .header').velocity('transition.slideDownIn');
                    $('[data-template="wall"] .wall').velocity('transition.slideUpIn');
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

            var type = window.location.hash.substr(1);
            type = type == "" ? "global" : type;
            Core.setWall(type);
        };

        var updateNote = function (index) {
            Core.updateNote(getNote(index));
        };

        var changeNoteContent = function () {
            ga('send', 'event', 'Note Interaction', 'Change Content');
        };

        var addNote = function (type, modifier) {
            if (modifier == undefined) {
                modifier = {};
                modifier.top = 75;
                modifier.left = 95;
            }

            var position = $('.wall-canvas').position();

            var note = {
                wall: Core.getRealWall(),
                top: position.top * -1 + modifier.top + 10,
                left: position.left * -1 + modifier.left + 50,
                colour: $scope.defaultTheme,
                content: "",
                angle: _.random(-3, 3),
                fontSize:$scope.defaultFontSize,
                icon: $scope.defaultIcon,
                type: type
            };

            if (type == "icon") {
                note.fontSize = 50;
                note.iconAngle = 0;
                //note.angle = 0;
            }

            Core.addNote(note);
            ga('send', 'event', 'Note Interaction', 'Add Note');
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
                    ga('send', 'event', 'Note Interaction', 'Moved Note');
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

        $scope.changeNoteContent = changeNoteContent;
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
