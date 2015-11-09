/// <reference path="typings/node/node.d.ts"/>

var fs = require('fs');
var gulp = require('gulp');
var globby = require('globby');

var exec = require('child_process').exec;

gulp.task('default', function() {
  // place code for your default task here
  console.log("gulp default");
});

gulp.task('sync', function(callback) {
    var tsConfig = require('./tsconfig.json');
    
    globby(tsConfig.filesGlob).then(function(matches) {
        
        tsConfig.files = matches;
        fs.writeFile('tsconfig.json', JSON.stringify(tsConfig, null, '    ') + '\n', callback);
    });
});

gulp.task('build', function (callback) {
    build(callback, false);
});

gulp.task('build-and-watch', function (callback) {
    build(callback, true);
});

function build(callback, watch) {
    var command = 'tsc';
    
    if (watch) {
        command += ' -w';
    }
    
    var cp = exec(command, callback);
    
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stdout);
}