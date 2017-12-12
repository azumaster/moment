var gulp = require('gulp');

gulp.task('copy', function () {
    return gulp.src('./dist/*.js')
        .pipe(gulp.dest('./../client/dist/dist'));
});


gulp.task('default', ['copy']);