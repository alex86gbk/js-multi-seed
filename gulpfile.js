const gulp = require('gulp');
const compass = require('gulp-compass');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const gulpSequence = require('gulp-sequence');
const del = require('del');

const publicPath = require('./.projectrc').publicPath.join('/');

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
  return gulp.src([
    `./dist/${publicPath}/**/*.css`,
    `./dist/${publicPath}/**/*.js`,
    `!./dist/${publicPath}/assets/**/*.*`
  ])
    .pipe(rev())
    .pipe(gulp.dest(`./dist/${publicPath}`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`./dist/${publicPath}`));
});

gulp.task('revCollector', function () {
  return gulp.src([
    `./dist/${publicPath}/**/*.json`,
    `./dist/${publicPath}/**/*.html`
  ])
    .pipe(revCollector())
    .pipe(gulp.dest(`./dist/${publicPath}`));
});

gulp.task('cleanOriginal', function () {
  return del([
    `./dist/${publicPath}/**/*.js`,
    `./dist/${publicPath}/**/*.css`,
    `!./dist/${publicPath}/assets/**/*.*`,
    `!./dist/${publicPath}/**/*-*.js`,
    `!./dist/${publicPath}/**/*-*.css`
  ]);
});

gulp.task('version', gulpSequence('rev', 'revCollector', 'cleanOriginal'));
