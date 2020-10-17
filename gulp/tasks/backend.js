let PATHS = require('./const.js');

module.exports = function(){
    $.gulp.task('backend',function () {
        return $.gulp.src(`${PATHS.srcBackPAth}/*`,{base: PATHS.srcBackPAth})
        .pipe($.gulp.dest(PATHS.backPath))
    });
}