let PATHS = require('./const.js');

module.exports = function(){
    $.gulp.task('fonts',function () {
        return $.gulp.src(`${PATHS.srcFrontPath}/fonts/**`, {base:PATHS.srcFrontPath})
        .pipe($.gulp.dest(PATHS.frontPath))
    });
}
