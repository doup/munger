var browserSync = require('browser-sync').create();
var del = require('del');
var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('clean', function () {
    return del(['dist', 'docs']);
});

gulp.task('build:scss', function (done) {
    done();
});

gulp.task('build:js', function (done) {
    done();
});

gulp.task('docs:copy', function (done) {
    done();
});

gulp.task('docs:jade', function () {
    return gulp.src('src/jade/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('docs'))
});

gulp.task('serve', function (done) {
    browserSync.init({
        server: {
            baseDir: './docs'
        }
    }, done);

    gulp.watch('src/jade/**/*.jade', gulp.series('docs', browserSync.reload()));
});

gulp.task('docs', gulp.parallel('docs:jade', 'docs:copy'));
gulp.task('build', gulp.parallel('build:scss', 'build:js'));
gulp.task('default', gulp.series('clean', 'build', 'docs', 'serve'));
