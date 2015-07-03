app.service('AnalyticsService', [function () {

    var GAEvents = [
        ['.add-note', 'UI Interaction', 'Add Note'],
        ['.header-new-wall', 'UI Interaction', 'New Wall (Header)'],
        ['.add-icon', 'UI Interaction', 'Add Icon'],
        ['.ui-users-btn', 'UI Interaction', 'Add / Remove Collaborators'],
        ['.share-btn', 'UI Interaction', 'Share WLL.space'],
        ['.ui-feedback-btn', 'UI Interaction', 'Give Us Feedback!'],
        ['.settings-btn', 'UI Interaction', 'Settings'],
        ['.header-burger', 'Note Interaction', 'Open Sidebar'],
        ['.note-change-theme', 'Note Interaction', 'Change Theme'],
        ['.note-change-icon', 'Note Interaction', 'Change Icon'],
        ['.note-rotate-icon', 'Note Interaction', 'Rotate Icon'],
        ['.note-change-size', 'Note Interaction', 'Change Font Size'],
        ['.note-close', 'Note Interaction', 'Remove Note']
    ];

    for (var i in GAEvents) {
        setGAAnalyticsEvent(GAEvents[i]);
    }

    function setGAAnalyticsEvent(array) {
        $(document).on('click', array[0], function () {
            console.log(array);
            //_trackEvent(array[1], array[2]);
            //_gaq.push(['_trackEvent', array[1], array[2]]);
            ga('send', 'event', array[1], array[2]);
        });
    }

    console.log(GAEvents);
}]);


