var argv = require('minimist')(process.argv.slice(2));
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var gif = require('gulp-if');
var isPublishDocsTask = argv._[0] == 'publish-docs';
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var reloadBrowser = function reloadBrowser(done) { browserSync.reload(); done(); };

if (isPublishDocsTask) {
    var baseUrl = 'https://doup.github.io/munger';
} else {
    var baseUrl = '';
}

gulp.task('clean', function () {
    return del(['dist', 'docs']);
});

gulp.task('build:js:munger', function () {
    return gulp.src('src/js/munger.js')
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(concat('munger.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:js:packed', function (done) {
    var files = [
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/slick-carousel/slick/slick.js',
        'src/js/munger.js',
    ];

    return gulp.src(files)
        .pipe(concat('munger.packed.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(concat('munger.packed.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('docs:copy:js', function (done) {
    return gulp.src('dist/munger.packed.js')
        .pipe(gif(isPublishDocsTask, uglify()))
        .pipe(concat('munger.js'))
        .pipe(gulp.dest('docs/assets'));
});

gulp.task('docs:copy:public', function (done) {
    return gulp.src('src/docs/public/**/*')
        .pipe(gulp.dest('docs'));
});

gulp.task('docs:pug', function () {
    return gulp.src(['src/docs/pug/**/*.pug', '!src/docs/pug/**/_*.pug'])
        .pipe(pug({
            locals: {
                url: (url) => baseUrl + url,
            }
        }))
        .pipe(gulp.dest('docs'))
});

gulp.task('docs:scss', function () {
    return gulp.src('src/docs/scss/*.scss')
        .pipe(sass({
            includePaths: [
                'node_modules/font-awesome/scss',
                'node_modules/foundation-sites/scss',
                'node_modules/magnific-popup/dist',
                'src/scss',
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('docs/assets'));
});

gulp.task('publish', function () {
    return gulp.src('docs/**/*')
      .pipe(ghPages());
});

gulp.task('serve', function (done) {
    browserSync.init({
        server: {
            baseDir: './docs'
        }
    }, done);
});

gulp.task('watch', function () {
    gulp.watch('src/docs/pug/**', gulp.series('docs:pug', reloadBrowser));
    gulp.watch(['src/docs/scss/**', 'src/scss/**'], gulp.series('docs:scss', reloadBrowser));
    gulp.watch(['src/docs/public/**', 'dist/**'], gulp.series('docs:copy', reloadBrowser));
    gulp.watch('src/js/**', gulp.series('build:js'));
});

gulp.task('docs:copy', gulp.series('docs:copy:public', 'docs:copy:js'));
gulp.task('docs', gulp.parallel('docs:pug', 'docs:scss', 'docs:copy'));
gulp.task('build:js', gulp.parallel('build:js:munger', 'build:js:packed'));
gulp.task('build', gulp.series('build:js'));
gulp.task('publish-docs', gulp.series('clean', 'build', 'docs', 'publish'));
gulp.task('default', gulp.series('clean', 'build', 'docs', 'serve', 'watch'));
