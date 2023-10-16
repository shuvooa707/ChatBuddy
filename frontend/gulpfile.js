import gulp from 'gulp';
import inlinesource from 'gulp-inline-source';
import replace from 'gulp-replace';

gulp.task('default', () => {
  return gulp
    .src('./public/*.html')
    .pipe(replace(`.js"></script>`, `.js" inline></script>`))
    .pipe(replace('rel="stylesheet">', 'rel="stylesheet" inline>'))
    .pipe(
      inlinesource({
        compress: true,
        ignore: ['png'],
      })
    )
    .pipe(gulp.dest('./build'));
});
