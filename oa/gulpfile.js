var gulp = require('gulp');

gulp.task('copy', function () {
    return gulp.src('./dist/*.js')
        .pipe(gulp.dest('./../server/dist'));
});


gulp.task('default', ['copy']);