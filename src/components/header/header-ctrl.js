(function () {
    app.controller('HeaderCtrl', ['$scope', 'GoogleAuth', 'Data', function ($scope, GoogleAuth, Data) {
        $scope.getName = GoogleAuth.getName;
        $scope.isSignedIn = GoogleAuth.isSignedIn;
        $scope.getImageUrl = GoogleAuth.getImageUrl;
    }]);
}());
