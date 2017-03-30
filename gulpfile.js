
//http://www.gregorygreen.info/debugging-gulp-js-tasks/
// to debug with node-inspector: node-debug $(which gulp) myTask

var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var runSequence = require('run-sequence');
var exec = require('child_process').exec,
  fs = require('fs');


// delete files created by Gulp and Webpack tasks
gulp.task('clean', function (cb) {
  return del([
    'dist/**/*',
    'dist',
  ], cb);
});


// These files are included in the dist.
var distFiles = [
    "package.json",
    "server.js",
    "config/**/*.*",
    "routes/**/*.js",
    "helpers/**/*.js",
    "Dockerfile"
];

gulp.task('copy-src-to-dist', function(cb) {
  return gulp.src(distFiles, {base: "."})
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', function(cb) {
  return runSequence(
    'clean',
    'copy-src-to-dist',
    cb
  );
});


gulp.on('err', function (err) {
  process.emit('exit') // or throw err
});

process.on('exit', function () {
  process.nextTick(function () {
    process.exit(exitCode)
  })
});

gulp.task('default', ['dist']);

