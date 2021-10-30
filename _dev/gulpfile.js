// gulpプラグインの読みこみ
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var spritesmith = require('gulp.spritesmith');
var convertEncoding = require('gulp-convert-encoding');
var replace = require('gulp-replace');
var plugins = require('gulp-load-plugins')();
var csscomb = require('gulp-csscomb');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var mozjpeg = require('imagemin-mozjpeg');
var babel = require("gulp-babel");

require('es6-promise').polyfill();

gulp.task('sprite', function () {
  var spriteData = gulp.src('sprite-materials/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../images/sprite/sprite.png',
    cssFormat: 'scss',
    padding: 3,
    cssVarMap: function (sprite) {
      sprite.name = sprite.name;
    },
    cssTemplate: 'spritesheet-templates/scss.template.mustache' //scssに出力する時に使用するテンプレート（/*～*/のデフォルトのコメントがcssに出力されないようにするため）
  }));
  spriteData.img.pipe(gulp.dest('../images/sprite/'));
  spriteData.css.pipe(gulp.dest('scss/'));
});

gulp.task('sass', function () {
  gulp.src('scss/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer('last 3 version'))
    .pipe(plugins.csscomb())
    .pipe(gulp.dest('../css'));
});

gulp.task('imagemin', function () {
  return gulp.src('../images/**/*.+(jpg|jpeg|png|gif|svg)')
    .pipe(plumber())
    .pipe(imagemin([
      pngquant({
        quality: '65-80',
        speed: 1,
        floyd: 0
      }),
      mozjpeg({
        quality: 85,
        progressive: true
      }),
      imagemin.svgo(),
      imagemin.optipng(),
      imagemin.gifsicle()
    ]
    ))
    .pipe(gulp.dest('../images/'));
});

gulp.task('babel', function () {
  gulp.src('js/run.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('../js/'));
});

gulp.task('watch', function () {
  gulp.watch('js/*.js', ['babel']);
  gulp.watch('scss/*/*.scss', ['sass']);
  gulp.watch('scss/*.scss', ['sass']);
});
gulp.task('default', ['sass', 'babel', 'watch']);