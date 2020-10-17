let PATHS = require('./const.js');

module.exports = function(){
    $.gulp.task('images',function(){
        return $.gulp.src(`${PATHS.srcFrontPath}/img/**`, {base: PATHS.srcFrontPath}) //base для миграции всей папки
        .pipe($.gulp.dest(PATHS.frontPath))
    });

    $.gulp.task('svg',function(){
        return $.gulp.src(`${PATHS.srcFrontPath}/svg/*.*`, {base: PATHS.srcFrontPath})
        .pipe($.gulp.dest(PATHS.frontPath))
    })
}