var gulp = require('gulp'),
  compass = require('gulp-compass'),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector'),
  gulpSequence = require('gulp-sequence'),
  del = require('del');

gulp.task('compass', function () {
  return gulp.src('./src/assets/scss/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './src/assets/css',
      sass: './src/assets/scss'
    }))
    .pipe(gulp.dest('./src/assets/css'));
});

gulp.task('rev', function () {
  return gulp.src(['./dist/**/*.css', './dist/**/*.js', '!./dist/assets/**/*.*'])
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'));
});

gulp.task('revCollector', function () {
  return gulp.src(['./dist/**/*.json', './dist/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('./dist'));
});

gulp.task('cleanOriginal', function () {
  return del(['./dist/**/*.js', './dist/**/*.css', '!./dist/assets/**/*.*', '!./dist/**/*-*.js', '!./dist/**/*-*.css']);
});

gulp.task('version', gulpSequence('rev', 'revCollector', 'cleanOriginal'));
