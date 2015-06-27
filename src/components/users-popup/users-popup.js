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
