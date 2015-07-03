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
