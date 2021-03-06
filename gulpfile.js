const gulp = require('gulp');
const del = require('del');
const exec = require('child_process').exec;
const path = require('path');
const nodemon = require('gulp-nodemon');
const gzip = require('gulp-zip');
const argv = require('yargs').argv;

//process.env.NODE_ENV = (argv.production) ? 'PRODUCTION' : 'DEVELOPMENT';

const clean = (done) => {
    return del(['./lib'])
}
exports.clean = clean;

const copy = (done) => {
    return gulp.src([
        './src/**/*.json',
        './web.config',
        './deploy.cmd',
        '.env'
    ]).pipe(gulp.dest('./lib'));
}
exports.copy = copy;

const tsc = (done) => {
    const cmd = path.resolve('node_modules', '.bin', 'tsc');
    return exec(cmd);

    exec(cmd, (err, stdout, stderr) => {
        if(stderr) console.log(stderr);
        if(err) throw err;
        done();
    });
}

exports.tsc = tsc;
exports.tsc.description = 'Runs the TypeScript compiler against the project.';


const build = gulp.series(tsc, copy);
exports.build = build;
exports.build.description = 'Builds the project.';

const watch = (done) => {
    return gulp.watch(['./src/**/*.*', './gulpfile.js', './**/*.env'], gulp.series(build))
}
exports.watch = watch;
exports.watch.description = 'Watches the project for changes, and then runs the build.';

function serve(done) {
    return nodemon({
        restartable: "rs",
        script: './lib/index.js',
        ext: 'ts json js',
        tasks: ['build'],
        ignore: ['./node_modules', './lib'],
        done: done
    });
}
exports.serve = gulp.series(build, serve);
exports.serve.description = 'Builds the project, starts the server, and watches for changes.';

/**
 * Compresses all *.js files in the deployment folder.
 */
const zip = (done) => {
    return gulp.src('./deployment/package/**/*.*')
        .pipe(gzip('icd2-bot.zip', { compress: true }))
        .pipe(gulp.dest('./deployment'));
}
exports.zip = zip;
exports.zip.description = 'Compresses all *.js files in the deployment folder.';

const package = (done) => {
    const files = ['./lib/**/*.*', './web.config', './package.json'];    

    return gulp.src(files)
    .pipe(gulp.dest('deployment/package'))
}

exports.package = gulp.series(build, package, zip);