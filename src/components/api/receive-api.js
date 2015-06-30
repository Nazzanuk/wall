(function () {
    app.service('ReceiveAPI', ["Core", function (Core) {
        var that = this;

        var events = function () {
            //socket.on('note', function(data){
            //    Data.receiveNote(data)
            //});

            socket.on('notes', function(data){
                notes(data);
            });

            socket.on('note', function(data){
                note(data);
            });

            socket.on('test', function(data){
                console.log('test', data)
            });

            socket.on('wall-list', function(data){
                wallList(data);
            });

            socket.on('wall-users', function(data){
                wallUsers(data);
            });
        };

        var notes = function (data) {
            Core.receiveNotes(data);
        };

        var note = function (data) {
            Core.receiveNote(data);
        };

        var wallList = function (data) {
            console.log('wall-list', data);
            Core.receiveWallList(data);
        };

        var wallUsers = function (data) {
            console.log('wall-users', data);
            Core.receiveWallUsers(data);
        };

        var init = function () {
            events();
        };

        init();

        that.notes = notes;

        return that;
    }]);
}());