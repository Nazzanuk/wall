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
