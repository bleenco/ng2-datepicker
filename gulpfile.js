var path = require('path');
var gulp = require('gulp');

var del = require('del');
var merge = require('merge2');

var sourceMap = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var gulpRun = require('gulp-run');
var gulpSeq = require('gulp-sequence');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var inlineResources = require('./scripts/inline-resources');

var DEST = path.join(__dirname, "dist");
var BUNDLE = path.join(__dirname, "bundle");
var TSCONFIG = "tsconfig.json";

gulp.task('clean', () => {
  return del([
    DEST,
    BUNDLE
  ]);
});

gulp.task('compile', gulpSeq('clean', ['compile:ts', 'compile:copy'], 'compile:inline'));
gulp.task('build', gulpSeq('clean', 'compile', 'build:ngc', 'build:rollup'));

gulp.task('compile:ts', () => {
  var tsProject = ts.createProject(TSCONFIG);

  var tsResult = tsProject.src()
    .pipe(sourceMap.init())
    .pipe(tsProject());

  return merge([
      tsResult.dts,
      tsResult.js.pipe(sourceMap.write('.'))
    ])
    .pipe(gulp.dest(DEST));
});

gulp.task('compile:copy', () => {
  gulp.src(['src/**/*.css', 'src/**/*.html'], {base: '.'})
    .pipe(gulp.dest(DEST));
});

gulp.task('compile:inline', () => {
  return inlineResources(DEST);
});

gulp.task('build:ngc', () => {
  return gulpRun('./node_modules/.bin/ngc -p ' + TSCONFIG).exec();
});

/* don't work yet see :
  https://github.com/rollup/rollup-plugin-typescript/issues/68
  http://stackoverflow.com/questions/39519823/using-rollup-for-angular-2s-aot-compiler-and-importing-moment-js
*/
gulp.task('build:rollup', () => {

  return;

  var globals = {
    // Angular dependencies
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',
    '@angular/http': 'ng.http',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',

    'moment': 'moment',
  };

  return rollup({
      entry: path.join(DEST, 'index.js'),
      context: 'this',
      globals: globals,
      external: Object.keys(globals),
      sourceMap: true,
      format: 'umd',
      moduleName:'ng2-datepicker',
    })
    .pipe(source('index.js', DEST))
    .pipe(buffer())
    .pipe(sourceMap.init({loadMaps: true}))
    .pipe(rename('ng2-datepicker.umd.js'))
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(DEST))
    /*
    .pipe(uglify())
    .pipe(rename('ng2-datepicker.umd.min.js'))
    .pipe(gulp.dest(DEST))
    */
    ;
});
