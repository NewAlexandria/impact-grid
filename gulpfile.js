var gulp = require('gulp');
var clean = require('gulp-clean');
var gConcat = require('gulp-concat');
var ngHtml2Js = require("gulp-ng-html2js");

// require sass
var sass = require('gulp-ruby-sass');

gulp.task('sass', function () {
  sass('src')
      .on('error', function (err) {
        console.error('Error!', err.message);
      })
      .pipe(gulp.dest('dist'));
});

gulp.task('clean-template', function () {
  return gulp
      .src(
        [
          'src/templates.js',
          'temp/templates/**/*.js'
        ],
        {force: true})
      .pipe(clean());
});

gulp.task('html2js', function() {
  gulp.src('src/impact-grid/**/*.html')
      .pipe(ngHtml2Js({
        moduleName: 'impact.directives.templates',
        prefix: "templates/impact-grid/"
      }))
      .pipe(gulp.dest('temp/templates'));

  gulp.src('temp/**/*.js')
      .pipe(gConcat('templates.js'))
      .pipe(gulp.dest('./src/'));
});

gulp.task('dist', function() {
  return gulp
      .src([
        'dist-prefix.js',
        'src/modules.js',
        'src/templates.js',
        'src/impact-grid/**/*.js',
        'dist-suffix.js'])
      .pipe(gConcat('impact-components.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['sass', 'clean-template', 'html2js', 'dist']);