let PATHS = require('./const.js');

module.exports = function(){
    $.gulp.task('scripts-ex',function () {
        return $.gulp.src([])//массив при условии, что будет добавлена сторонняя библиотека
        .pipe($.concat('libs.min.js'))
        .pipe($.gulp.dest(PATHS.frontPath))
    });

    $.gulp.task('script',function () {
        return $.gulp.src(`${PATHS.srcFrontPath}/js/*.js`)
        .pipe($.gulp.dest(PATHS.frontPath))
    });
}