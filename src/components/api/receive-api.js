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

            socket.on('test', function(data){
                console.log('test', data)
            });

            socket.on('wall-list', function(data){
                wallList(data);
            });
        };

        var notes = function (data) {
            Core.receiveNotes(data);
        };

        var wallList = function (data) {
            console.log('wall-list', data)
            Core.receiveWallList(data);
        };

        var init = function () {
            events();
        };

        init();

        that.notes = notes;

        return that;
    }]);
}());