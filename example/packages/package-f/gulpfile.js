const gulp = require('gulp')
const run = require('mrbt').command

gulp.task('clean', done => {
    console.log('Gulp "clean" task for package-f')
    run.npm(['-v'], done)
})

gulp.task('build', done => {
    console.log('Gulp "build" task for package-f')
    run.yarn(['-v'], done)
})

gulp.task('publish', () => {
    console.log('Gulp "publish" task for package-f')
})
