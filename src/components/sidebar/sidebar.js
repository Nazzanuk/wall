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
