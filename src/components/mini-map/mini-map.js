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
