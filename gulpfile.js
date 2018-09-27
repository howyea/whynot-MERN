var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./server/tsconfig.json");

gulp.task("default", function () {
    return gulp.src('server/**/*.ts')
        .pipe(tsProject())
        .js.pipe(gulp.dest("server_d"));
});
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('./server/**/*.ts', ['default']);
  });