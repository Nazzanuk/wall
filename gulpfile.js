var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    karma = require('gulp-karma'),
    istanbul = require('istanbul'),
    ejs = require("gulp-ejs"),
    jf = require('jsonfile'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    webserver = require('gulp-webserver');

var paths = {
    src: 'src/',
    release: 'release/',
    public: 'release/public/'
};

gulp.task("default", function(){
    gulp.start([
        'copy-public',
        'gen-css-lib',
        'gen-css',
        'gen-js-lib',
        'gen-js',
        'gen-html'
    ]);
});

gulp.task("gen-css", function(){
    return gulp.src(['src/app.scss'])
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(paths.public));
});

gulp.task("gen-css-lib", function(){
    return gulp.src([
        'src/bower-components/bootstrap/dist/css/bootstrap.min.css'
    ])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(paths.public));
});

gulp.task("gen-js", function(){
    return gulp.src(['src/app.js', 'src/components/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.public));
});

gulp.task("gen-js-lib", function(){
    return gulp.src([
        'src/bower-components/jquery/dist/jquery.min.js',
        'src/bower-components/jquery-ui/jquery-ui.min.js',
        //'src/bower-components/jqueryui-touch-punch/jquery.ui.touch-punch.js',
        'src/bower-components/angular/angular.min.js',
        'src/bower-components/velocity/velocity.min.js',
        'src/bower-components/velocity/velocity.ui.min.js',
        'src/bower-components/underscore/underscore-min.js',
        'src/bower-components/moment/moment.js',
        'src/bower-components/rxjs/dist/rx.all.js',
        'src/bower-components/bootstrap/dist/js/bootstrap.js'
    ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(paths.public));
});

gulp.task("copy-public", function(){
    return gulp.src(['src/public/**/*.*'])
        .pipe(gulp.dest(paths.public));
});


gulp.task("gen-html", function(){
    var pages = {
        index: ['head', 'header', 'sidebar', 'google-auth', 'wall', 'footer']
    };


    for (var i in pages){
        var sources = []
        for (var j in pages [i]){
            var ejs = pages[i][j];
            sources.push("src/components/" + ejs + "/" + ejs + ".ejs");
        }
        gulp.src(sources)
            .pipe(concat(i + ".html"))
            .pipe(gulp.dest (paths.release));
    }
});

gulp.task('watch', ['webserver', 'default'], function () {
    gulp.watch([
        'src/components/**/*',
        'src/public/**/*',
        'src/app/js',
        'src/app/scss'
    ], ['default']);
});

gulp.task('webserver', function() {
    gulp.src('release')
        .pipe(webserver({
            livereload: {
                port:7001,
                enable:true
            },
            open: true,
            port:7000
        }));
});