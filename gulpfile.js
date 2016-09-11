var gulp = require("gulp");
var bower = require("main-bower-files");
var filter = require("gulp-filter");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var livereload = require("gulp-livereload");
var runSeq = require("run-sequence");
var uglify = require("gulp-uglify");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var replace = require('gulp-replace');

gulp.task("bower", function() {
  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css");

  return gulp.src(bower({
    overrides: {
      bootstrap: {
        main: [
          "dist/css/bootstrap.css",
          "dist/js/bootstrap.js"
        ]
      }
    }
  }))
    .pipe(jsFilter)
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest("public/js"))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat("vendor.css"))
    .pipe(gulp.dest("public/css"));
});

gulp.task("concat", function() {
  gulp.src(["lib/**/app.js", "lib/**/*.js"])
    .pipe(concat("app.js"))
    .pipe(gulp.dest("public/js"));
});

gulp.task("sass", function() {
  gulp.src("lib/scss/style.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/css"));
});

gulp.task("copy", function() {
  gulp.src("lib/templates/**")
    .pipe(gulp.dest("public/templates"));
});

gulp.task('compress', function () {
  return gulp.src('public/js/app.js')
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('public/js'));
});

gulp.task('minify-css', function() {
  return gulp.src('public/css/style.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('replace:prod', function() {
  return gulp.src('public/index.html')
    .pipe(replace(/style\.css/, 'style.min.css'))
    .pipe(replace(/app\.js/, 'app.min.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('replace:dev', function() {
  return gulp.src('public/index.html')
    .pipe(replace(/style\.min\.css/, 'style.css'))
    .pipe(replace(/app\.min\.js/, 'app.js'))
    .pipe(gulp.dest('public'));
});

gulp.task("default", function() {
  livereload.listen();

  //runs soon as gulp is started. 
  runSeq('bower', ['sass', 'concat', 'copy'], 'replace:dev');

  //watches for changes in files before running sequences. 
  gulp.watch(["lib/**/*", "public/index.html", "public/templates/**"], function() {
    runSeq(["concat", "sass", "copy"], function() {
      livereload.reload("public/index.html");
    });
  });

  gulp.watch("bower.json", function() {
    runSeq("bower", function() {
      livereload.reload("public/index.html");
    });
  });
});

gulp.task('build', function() {
  runSeq('bower', ['sass', 'concat'], 'minify-css', 'compress', 'replace:prod')
});