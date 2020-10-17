let PATHS = require('./const.js');

module.exports = function(){
    $.gulp.task('pug',function () {
        return $.gulp.src(`${PATHS.srcFrontPath}/pug/*.pug`)
        .pipe($.pug({
            pretty:true
        }))
        .pipe($.gulp.dest(PATHS.frontPath));
    });
    
}
