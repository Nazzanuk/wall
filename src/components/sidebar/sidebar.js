(function () {
    app.controller('SidebarCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Core', function ($scope, $timeout, GoogleAuth, Core) {

        $scope.addWallName = "";

        var events = function () {
            $(document).on('click','.header-burger', function () {
                $('.sidebar').velocity('stop').velocity('transition.slideLeftBigIn', {duration:300});
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
            Core.setWall(wallName);
            //Core.updateWall({name:wallName, users:[GoogleAuth.getEmail()]}).then(function () {
            //    Core.loadWallList();
            //});
        };

        init();

        $scope.addWall = addWall;
        $scope.setWall = setWall;
        $scope.setMyWall = setMyWall;
        $scope.getWallList = Core.getWallList;
    }]);
}());
