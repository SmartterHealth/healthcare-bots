const gulp = require('gulp');
const del = require('del');
const exec = require('child_process').exec;
const path = require('path');
const nodemon = require('gulp-nodemon');
const zip = require('gulp-zip');
const argv = require('yargs').argv;

//process.env.NODE_ENV = (argv.production) ? 'PRODUCTION' : 'DEVELOPMENT';

const clean = (done) => {
    return del(['./lib'])
}
exports.clean = clean;

const copyJson = (done) => {
    return gulp.src(['./src/**/*.json'])
        .pipe(gulp.dest('./lib'));
}

const copyMisc = (done) => {
    return gulp.src([
        './web.config',
        './deploy.cmd',
        '.env'
    ]).pipe(gulp.dest('./lib'));
}
exports.copy = gulp.series(copyMisc, copyJson);

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


const build = gulp.series(tsc, exports.copy);
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

const package = (done) => {
    const files = ['./lib/**/*.*', './web.config', './package.json'];    

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        files.push('./icd2.env');
        files.push('./benefits.env');
    }

    return gulp.src(files)
    .pipe(gulp.dest('deployment/package'))
}

exports.package = gulp.series(build, package);