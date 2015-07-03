(function () {
    app.controller('HeaderCtrl', ['$scope', 'GoogleAuth', 'Core', function ($scope, GoogleAuth, Core) {
        $scope.getName = GoogleAuth.getName;
        $scope.getWall = Core.getWall;
        $scope.isSignedIn = GoogleAuth.isSignedIn;
        $scope.getImageUrl = GoogleAuth.getImageUrl;
    }]);
}());
