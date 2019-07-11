const gulp = require('gulp');
const compass = require('gulp-compass');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const gulpSequence = require('gulp-sequence');
const del = require('del');
const _ = require('lodash');

const publicPath = require('./.projectrc').publicPath.join('/');

gulp.task('compass', () => {
  return gulp.src('./src/assets/scss/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './src/assets/css',
      sass: './src/assets/scss',
    }))
    .pipe(gulp.dest('./src/assets/css'));
});

gulp.task('rev', () => {
  return gulp.src([
    `./dist/${publicPath}/**/*.css`,
    `./dist/${publicPath}/**/*.js`,
    `!./dist/${publicPath}/assets/**/*.*`,
  ])
    .pipe(rev())
    .pipe(gulp.dest(`./dist/${publicPath}`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`./dist/${publicPath}`));
});

gulp.task('revCollector', () => {
  return gulp.src([
    `./dist/${publicPath}/**/*.json`,
    `./dist/${publicPath}/**/*.html`,
  ])
    .pipe(revCollector())
    .pipe(gulp.dest(`./dist/${publicPath}`));
});

gulp.task('cleanOriginal', () => {
  const originalFiles = [];
  const manifest = require(`./dist/${publicPath}/rev-manifest.json`);
  _.forEach(manifest, (value, key) => {
    originalFiles.push(`./dist/${publicPath}/${key}`);
  });
  originalFiles.push(`./dist/${publicPath}/rev-manifest.json`);
  return del(originalFiles);
});

gulp.task('copyPublic', () => {
  gulp.src('./public/**/*.*')
    .pipe(gulp.dest(`./dist/${publicPath}`));
});

gulp.task('version', gulpSequence('rev', 'revCollector', 'cleanOriginal', 'copyPublic'));
