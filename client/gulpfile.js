var gulp = require('gulp'),
    uglify = require('gulp-uglify')

gulp.task('copy', function () {
    return gulp.src('./public/js/*/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('default', ['copy']);