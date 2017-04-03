
//http://www.gregorygreen.info/debugging-gulp-js-tasks/
// to debug with node-inspector: node-debug $(which gulp) myTask

const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');


// delete files created by Gulp and Webpack tasks
gulp.task('clean', function (cb) {
  return del([
    'dist/**/*',
    'dist',
  ], cb);
});


// These files are included in the dist.
const distFiles = [
    "package.json",
    "server.js",
    "config/**/*.*",
    "controllers/**/*.js",
    "helpers/**/*.js",
    "middlewares/**/*.js",
    "models/**/*.js",
    "views/**/*.js",
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

