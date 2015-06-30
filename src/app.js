var app = angular.module('app', []);

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

var currentMousePos = {left: -1, top: -1};
$(document).mousemove(function (event) {
    currentMousePos.left = event.pageX;
    currentMousePos.top = event.pageY;
});

//var socket = io('http://localhost:4000');
var socket = io('https://nameless-beyond-9248.herokuapp.com');
socket.on('connect', function () {
    console.log('connected!')
});
socket.on('disconnect', function () {
});