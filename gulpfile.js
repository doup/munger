var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('clean', function () {
    return del('dist');
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

gulp.task('watch', function () {
    gulp.watch('src/js/**', gulp.series('build:js'));
});

gulp.task('build:js', gulp.parallel('build:js:munger', 'build:js:packed'));
gulp.task('build', gulp.series('clean', 'build:js'));
gulp.task('default', gulp.series('clean', 'build:js', 'watch'));
