// /usr/bin/node /tank/disk0/organized/Git/annict-formatter/node_modules/gulp/bin/gulp.js --color --gulpfile /tank/disk0/organized/Git/annict-formatter/gulpfile.js --FILE_NAME=totp.ts --PATH_SRC=./src/totp.ts

var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var minimist = require('minimist');

var args = minimist(process.argv.slice(2))
var name = {
    out: args.FILE_NAME.replace('.ts', '.min.js'),
    out_bookmark: args.FILE_NAME.replace('.ts', '.bookmarklet.min.js'),
}
var path = {
    src: args.PATH_SRC
}

gulp.task('default', () => {
    return gulp.src(path.src)
        .pipe(ts({
            noImplicitAny: true,
            // outFile: name.out
            outFile: name.out_bookmark
        }))
        .pipe(uglify())
        .pipe(replace(/^/, 'javascript:'))
        .pipe(gulp.dest('./dist/'));
});
