let PATHS = require('./const.js');

module.exports = function(){
    $.gulp.task('html',function () {
        return $.gulp.src(`${PATHS.srcFrontPath}/html/index.html`)
        .pipe($.gulp.dest(PATHS.frontPath));
    });
    
}
