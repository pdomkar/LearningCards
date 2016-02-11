var gulp         = require('gulp');
var sass         = require('gulp-ruby-sass');
var minifycss    = require('gulp-minify-css');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var watch        = require('gulp-watch');
var copy         = require('gulp-copy');

var path = {
    css: {
        src: './app/sass',
        dst: 'app/css'
    }
};

gulp.task('scss-vendor', function ()
{
    // copy Bootstrap
    gulp.src('node_modules/bootstrap-sass/assets/stylesheets/bootstrap/**')
        .pipe(copy(path.css.src + '/bootstrap/', {prefix: 5}));

    // copy Bootstrap-tagsinput
    gulp.src('node_modules/bootstrap-tagsinput/src/bootstrap-tagsinput.css')
        .pipe(copy(path.css.src + '/bootstrap-tagsinput/', {prefix: 3}));
});

gulp.task('scss', function()
{
    return sass(path.css.src + '/**/*.scss', { style: 'expanded' })
        .pipe(concat('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(path.css.dst));
});

gulp.task('watch', function()
{
    gulp.watch(path.css.src + '/**/*.scss', ['scss']);
});
