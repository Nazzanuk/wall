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
