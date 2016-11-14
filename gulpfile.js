var path = require('path');
var gulp = require('gulp');

var del = require('del');
var merge = require('merge2');

var sourceMap = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var gulpTs = require('gulp-typescript');
var gulpRun = require('gulp-run');
var gulpSeq = require('gulp-sequence');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var rollup = require('rollup-stream');
var rollupTs = require('rollup-plugin-typescript');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var inlineResources = require('./scripts/inline-resources');

var DEST = path.join(__dirname, "dist");
var BUNDLE = path.join(__dirname, "bundle");
var TSCONFIG = "tsconfig.json";

gulp.task('clean', () => {
  return del([
    DEST,
    'ng2-datepicker.js',
    BUNDLE
  ]);
});

gulp.task('compile', gulpSeq('clean', ['compile:ts', 'compile:sass', 'compile:copy'], 'compile:inline'));
gulp.task('build', gulpSeq('clean', 'compile', 'build:ngc', 'build:rollup'));

gulp.task('compile:ts', () => {
  var tsProject = gulpTs.createProject(TSCONFIG);

  var tsResult = tsProject.src()
    .pipe(sourceMap.init())
    .pipe(tsProject());

  return merge([
      tsResult.dts,
      tsResult.js.pipe(sourceMap.write('.'))
    ])
    .pipe(gulp.dest(DEST));
});

/* TODO sass compilation should be done during inline-resource
 * we should use styleUrl: ['icon.scss'] not icon.css
 */
gulp.task('compile:sass', () => {
  gulp.src('src/**/*.scss', {base: 'src/'})
    .pipe(sourceMap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(DEST));
});

gulp.task('compile:copy', () => {
  gulp.src(['src/**/*.css', 'src/**/*.html'], {base: 'src/'})
    .pipe(gulp.dest(DEST));
});

gulp.task('compile:inline', () => {
  return inlineResources(DEST);
});

gulp.task('build:ngc', () => {
  return gulpRun('./node_modules/.bin/ngc -p ' + TSCONFIG).exec();
});

gulp.task('build:rollup', () => {
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
      entry: 'dist/ng2-datepicker.js',
      context: 'this',
      globals: globals,
      external: Object.keys(globals),
      sourceMap: true,
      format: 'umd',
      moduleName:'ng2.datepicker',
      plugins: [
        /*
          export of interface causes errors to rollup
          https://github.com/rollup/rollup-plugin-typescript/issues/65
         */
        {
          name: 'replace interface export',
          transform: code =>
            ({
              code: code.replace(/export\s*{\s*RangeSelectDirective,\s*RangeDate\s*}/g, 'export { RangeSelectDirective }'),
              map: { mappings: '' }
            })
        },
        rollupTs({
          typescript: require('typescript')
        })
      ]
    })
    .pipe(source('ng2-datepicker.ts', 'src'))
    .pipe(buffer())
    .pipe(sourceMap.init({loadMaps: true}))
    .pipe(rename('ng2-datepicker.umd.js'))
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(BUNDLE))

    //min version
    .pipe(filter(['**/*', '!**/*.map']))
    .pipe(uglify())
    .pipe(rename('ng2-datepicker.umd.min.js'))
    .pipe(gulp.dest(BUNDLE));
});
