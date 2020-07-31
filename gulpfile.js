/* eslint-disable */
const gulp = require('gulp');
const compass = require('gulp-compass');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const del = require('del');
const _ = require('lodash');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

const projectRc = require('./.projectrc');
const publicPath = projectRc.publicPath.length >= 1 ? projectRc.publicPath.join('/') + '/' : '';

gulp.task('compass', () => {
  return gulp.src('./src/assets/scss/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './src/assets/css',
      sass: './src/assets/scss',
    }))
    .pipe(gulp.dest('./src/assets/css'));
});

gulp.task('uglifyJS', gulp.series(() => {
  return gulp.src(`./dist/${publicPath}assets/js/*.js`)
    .pipe(uglify())
    .pipe(gulp.dest(`./dist/${publicPath}assets/js/`));
}));

gulp.task('cleanCSS', gulp.series(() => {
  return gulp.src(`./dist/${publicPath}assets/css/*.css`)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(`./dist/${publicPath}assets/css/`));
}));

gulp.task('rev', gulp.series(() => {
  return gulp.src([
    `./dist/${publicPath}**/*.css`,
    `./dist/${publicPath}**/*.js`,
    `!./dist/${publicPath}assets/images/**/*.*`,
    `!./dist/${publicPath}assets/scss/**/*.*`,
    `!./dist/${publicPath}assets/vendor/**/*.*`,
  ])
    .pipe(rev())
    .pipe(gulp.dest(`./dist/${publicPath}`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`./dist/${publicPath}`));
}));

gulp.task('revCollector', gulp.series(() => {
  return gulp.src([
    `./dist/${publicPath}**/*.json`,
    `./dist/${publicPath}**/*.html`
  ])
    .pipe(revCollector())
    .pipe(gulp.dest(`./dist/${publicPath}`));
}));

gulp.task('cleanOriginal', gulp.series((done) => {
  const originalFiles = [];
  const manifest = require(`./dist/${publicPath}rev-manifest.json`);
  _.forEach(manifest, function (value, key) {
    originalFiles.push(`./dist/${publicPath}${key}`);
  });
  originalFiles.push(`./dist/${publicPath}rev-manifest.json`);
  del([`./dist/${publicPath}assets/scss`]);
  del(originalFiles);
  done();
}));

gulp.task('copyPublic', gulp.series((done) => {
  gulp.src('./public/**/*.*')
    .pipe(gulp.dest(`./dist/${publicPath}`));
  done();
}));

gulp.task('version', gulp.series('uglifyJS', 'cleanCSS', 'rev', 'revCollector', 'cleanOriginal', 'copyPublic'));
