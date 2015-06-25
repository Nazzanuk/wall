(function () {
    app.controller('WallCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Data', function ($scope, $timeout, GoogleAuth, Data) {

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
            return Data.getNotes()[index];
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
                return Data.getNotes();
            }, function (isSignedIn) {
                //console.log(isSignedIn);
                if (isSignedIn) {
                    $timeout(function () {
                        setDraggable($(".note"));
                    }, 50);
                }
            }, true);

            $(document).on('mouseup mouseenter',function (e) {
                update();
                //console.log('refreshing from click...')
            });

            $(window).on('focus', function () {
                update();
                //console.log('refreshing from window...')
            });
        };

        var timeout;
        var update = function () {
            console.log('schedule refresh');
            $timeout.cancel(timeout);
             timeout = $timeout(function () {
                 console.log('actual refresh');
                Data.loadNotes();
            }, 5000);
        };



        var start = function () {
            Data.setEmail(GoogleAuth.getEmail());
            Data.loadWallList().then(function (data) {
                Data.setWall(data[0].name);
            });

            $timeout(function () {
                update();
            }, 10000);
        };

        var updateNote = function (index) {
            Data.updateNote(Data.getNotes()[index]);
            update();
        };

        var newNote = function (index) {
            Data.newNote(Data.getNotes()[index]);
        };

        var addNote = function (type) {
            var note = {
                wall: Data.getWall(),
                top: 25055,
                left: 25055,
                colour: $scope.colour,
                content: "",
                angle: _.random(-3, 3),
                icon:$scope.defaultIcon,
                type:type
            };

            if (type == "icon") {
                note.fontSize = 50;
                note.iconAngle = 0;
                note.angle = 0;
            }


            Data.getNotes().push(note);
            var index = Data.getNotes().length - 1;

            newNote(index);
        };

        var removeNote = function (index) {
            Data.getNotes()[index].wall = undefined;
            var $element = $("[note-id='" + index + "']");
            $($element).hide();
            updateNote(index);
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
                    //console.log('Data.getNotes()[id]', Data.getNotes()[id]);
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
                setDraggable($(".note"));
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
