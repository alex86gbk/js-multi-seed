var gulp = require('gulp'),
  compass = require('gulp-compass'),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector'),
  gulpSequence = require('gulp-sequence');

gulp.task('compass', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './src/css',
      sass: './src/scss'
    }))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('rev', function () {
  return gulp.src(['./dist/*.css', './dist/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'));
});

gulp.task('revCollector', function () {
  return gulp.src(['./dist/*.json', './dist/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('./dist'));
});

gulp.task('version', gulpSequence('rev', 'revCollector'));
