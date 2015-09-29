var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');

gulp.task('usemin', function() {
  return gulp.src('app/views/**/*.handlebars')
    .pipe(usemin({
      js: [uglify()],
      css: [minifyCss()]
    }))
    .pipe(gulp.dest('dist/views/'));
});

gulp.task('browser-sync', function() {
    browserSync({
      proxy: 'localhost',
      browser: 'google-chrome',
      notify: false
    });
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('templates', function() {
  gulp.src('app/views/**/*.handlebars')
    .pipe(gulp.dest('dist/views'));
});

gulp.task('default', ['sass', 'browser-sync'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/views/**/*.handlebars', ['bs-reload', 'templates']);
});
