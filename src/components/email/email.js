(function () {
    app.service('Email', ['Core', 'GoogleAuth', '$http', function (Core, GoogleAuth, $http) {
        var that = this;

        var baseEmail = {
            "key": "aFC8zfGEpNgr0iUd5sRF1Q",
            "message": {
                "html": "<p>Example HTML content</p>",
                "subject": "example subject",
                "from_email": "info@wll.space",
                "from_name": "WLL.space",
                "to": [
                    {
                        "email": "nazzanuk@gmail.com"
                    }
                ]
            }
        };

        var sendCollaborationInvite = function (email) {
            var obj = _.clone(baseEmail);

            obj.message.html = '<style>a{color:#51c7f1;font-weight:bold;}</style>' +
            '<a href="http://wll.space"><img style="width:300px;height:auto;" src="https://gallery.mailchimp.com/cef6196e11327b192c5c4baac/images/787a7310-446e-4f7e-8b8d-e49a0600f5c5.png" alt="WLL.space"/></a><br/><br/>' +
            '<h2>You have been invited to collaborate on WLL.space!</h2>' +
            '<p>' + GoogleAuth.getName() + ' has invited you to start collaborating on ' +
            '<a href="http://app.wll.space/#' + Core.getWall() + '">#' + Core.getWall() + '</a></p>' +
            '<p><a href="http://app.wll.space/#' + Core.getWall() + '">Start collaborating on #' + Core.getWall() + ' now!</a></p>';

            obj.message.subject = "You have received an invitation to WLL.space";
            obj.message.to = [{"email": email}];

            $http.post('https://mandrillapp.com/api/1.0/messages/send.json', obj)
                .success(function (data, status, headers, config) {
                    console.log('email sent', data);
                }).error(function (data, status, headers, config) {
                    console.log('email not sent', data);
                });
        };

        that.sendCollaborationInvite = sendCollaborationInvite;

    }]);
}());
