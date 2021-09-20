'use strict';

const gulp = require ('gulp'),
plumber = require ('gulp-plumber'),
autoprefixer = require ('gulp-autoprefixer'),
terser = require ('gulp-terser'),
sass = require ('gulp-sass') (require ('node-sass')),
htmlmin = require ('gulp-htmlmin'),
rigger = require ('gulp-rigger'),
browserSync = require('browser-sync'),
rimraf = require ('rimraf'),
reload = browserSync.reload;

const path = {
  build: {
    html: 'build/',
    scss: 'build/css/',
    js: 'build/js/',
    fonts: 'build/fonts',
    img: 'build/img',
  },
  src: {
    html: 'src/*.{html,htm}',
    scss: 'src/scss/main.scss',
    js: ['src/js/libs.js', 'src/js/app.js'],
    fonts: 'src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    img: 'src/img/**/*.{jpeg,jpg,png,svg,gif,webp}',
  },
  watch:{
    html: 'src/index.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*..js',
    fonts: 'src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    img: 'src/img/**/*.{jpeg,jpg,png,svg,gif,webp}',
  },
  clean: 'build/'
},
config ={
  server: {
    baseDir: 'build/'
  },
  tunnel:true,
  port:7787,
  logPrefix: "WebDev"
};

gulp.task('clean', function (done){
  rimraf(path.clean, done);

});

gulp.task('mv:fonts', function (done){
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('mv:img', function (done){
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('build:html', function (done){
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true,
      removeComments: true,
      useShortDoctype: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('build:scss', function (done){
  gulp.src(path.src.scss, {sourcemaps:true})
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      cascade: false,
      remove: true
    }))
    .pipe(gulp.dest(path.build.scss, {sourcemaps:'.'}))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('build:js', function (done){
  gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(terser())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('watch', function (done) {
  gulp.watch(path.watch.fonts, gulp.series('mv:fonts'));
  gulp.watch(path.watch.html, gulp.series('build:html'));
  gulp.watch(path.watch.scss, gulp.series('build:scss'));
  gulp.watch(path.watch.js, gulp.series('build:js'));
  gulp.watch(path.watch.img, gulp.series('mv:img'));
  done();
});

gulp.task('webserver', function (done){
  browserSync(config);
  done();
});
gulp.task('default', gulp.series('clean', 'mv:fonts', 'mv:img', 'build:html', 'build:scss','build:js','watch','webserver'));