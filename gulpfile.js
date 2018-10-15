var gulp = require("gulp");
var ts = require("gulp-typescript");
var util=require('gulp-util');
var plumber=require('gulp-plumber');
var tsProject = ts.createProject("./server/tsconfig.json");
function errorHandle(e){
	util.beep(); //控制台发声,错误时beep一下
	util.log(e);
}
gulp.task("default", function () {
    return gulp.src('server/**/*.ts')
        .pipe( plumber({errorHandler:errorHandle}) )  //在处理前注册plumber
        .pipe(tsProject())
        .js.pipe(gulp.dest("server_d"));
});
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('./server/**/*.ts', ['default']);
  });