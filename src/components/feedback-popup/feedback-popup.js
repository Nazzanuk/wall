(function () {
    app.controller('FeedbackPopupCtrl', ['$scope', '$timeout', 'GoogleAuth', 'Core', function ($scope, $timeout, GoogleAuth, Core) {

        $scope.feedback = "";

        var events = function () {

            $(document).on('click','.ui-feedback-btn', function () {
                openFeedbackPopup();
            });

            $(document).on('click','.close-feedback-popup', function () {
                closeFeedbackPopup();
            });
        };

        var openFeedbackPopup = function () {
            $('.feedback-popup').velocity('stop').velocity('transition.flipYIn', {duration:300});
        };

        var closeFeedbackPopup = function () {
            $('.feedback-popup').velocity('stop').velocity('transition.flipYOut', {duration:300});
        };

        var sendFeedback = function () {
            Core.sendFeedback($scope.feedback);
            closeFeedbackPopup();
            ga('send', 'event', 'Feedback', 'Provided Feedback');
        };

        var init = function () {
            events();

            $timeout(function () {
                $('.ui-feedback-btn').velocity('stop').velocity('callout.shake');
            },10000);
        };

        init();

        $scope.sendFeedback = sendFeedback;
    }]);
}());
