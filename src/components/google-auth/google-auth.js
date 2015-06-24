(function () {
    app.service('GoogleAuth', ['$rootScope', function ($rootScope) {

        window.GoogleAuth = this;
        var that = this;

        var signedIn = false;
        var profile;

        that.onSignIn = function (googleUser) {
            signedIn = true;

            // Useful data for your client-side scripts:
            profile = googleUser.getBasicProfile();
            //console.log("ID: " + profile.getId()); // Don't send this directly to your server!
            //console.log("Name: " + profile.getName());
            //console.log("Image URL: " + profile.getImageUrl());
            //console.log("Email: " + profile.getEmail());

            //console.table(profile);

            // The ID token you need to pass to your backend:
            var id_token = googleUser.getAuthResponse().id_token;
            //console.log("ID Token: " + id_token);
            $rootScope.$apply();
        };

        var getName = function () {
            if (!isSignedIn()) return;
            //console.log(profile.getName());
            return profile.getName();
        };

        var getImageUrl = function () {
            if (!isSignedIn()) return;
            return profile.getImageUrl();
        };

        var getEmail = function () {
            if (!isSignedIn()) return;
            return profile.getEmail();
        };

        var isSignedIn = function () {
            return signedIn;
        };

        that.isSignedIn = isSignedIn;
        that.getName = getName;
        that.getImageUrl = getImageUrl;
        that.getEmail = getEmail;


        return that;

    }]);
}());

function onSignIn(user) {
    GoogleAuth.onSignIn(user);
}
