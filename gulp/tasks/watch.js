let PATHS = require('./const.js');

module.exports = function(){   
    $.gulp.task('watch', function() {
        $.gulp.watch(`${PATHS.srcFrontPath}/html/index.html`, $.gulp.series('html'));
        $.gulp.watch(`${PATHS.srcFrontPath}/stylus/**/*.styl`, $.gulp.series('stylus'));
        $.gulp.watch(`${PATHS.srcFrontPath}/js/*.js`, $.gulp.series('script'));
        $.gulp.watch(`${PATHS.srcFrontPath}/img`, $.gulp.series('cleaner-img','images','html'));
        $.gulp.watch(`${PATHS.srcFrontPath}/svg`, $.gulp.series('cleaner-svg','svg','html'));
        $.gulp.watch(`${PATHS.srcBackPAth}`, $.gulp.series('backend'));
    });
}