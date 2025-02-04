
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const browserSync = require("browser-sync").create();
const ghPages = require("gulp-gh-pages");

// Paths
const paths = {
    html: "*.html",
    css: "styles/**/*.scss",
    js: "scripts/**/*.js",
    dist: "dist",
};

// Minify HTML
gulp.task("html", function () {
    return gulp
        .src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

// Compile SCSS & Minify CSS
gulp.task("css", function () {
    return gulp
        .src(paths.css)
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${paths.dist}/styles`))
        .pipe(browserSync.stream());
});

// Minify JS
gulp.task("js", function () {
    return gulp
        .src(paths.js)
        .pipe(uglify())
        .pipe(gulp.dest(`${paths.dist}/scripts`))
        .pipe(browserSync.stream());
});

// Serve & Watch
gulp.task("serve", function () {
    browserSync.init({
        server: {
            baseDir: paths.dist,
        },
    });

    gulp.watch(paths.html, gulp.series("html"));
    gulp.watch(paths.css, gulp.series("css"));
    gulp.watch(paths.js, gulp.series("js"));
});

// Deploy to GitHub Pages
gulp.task("deploy", function () {
    return gulp.src(`${paths.dist}/**/*`).pipe(ghPages());
});

// Default Task
gulp.task("default", gulp.series("html", "css", "js", "serve"));
