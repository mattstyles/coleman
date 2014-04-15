/**
 * Coleman.
 * Your very own personal manbot.
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 */

'use strict';

var path         = require( 'path' ),

    gulp         = require( 'gulp' ),
    mocha        = require( 'gulp-mocha' ),
    plumber      = require( 'gulp-plumber' ),
    notify       = require( 'gulp-notify' ),
    gutil        = require( 'gulp-util' ),
    gulpif       = require( 'gulp-if' ),
    rimraf       = require( 'gulp-rimraf' ),
    browserify   = require( 'gulp-browserify' ),
    uglify       = require( 'gulp-uglify' ),
    jshint       = require( 'gulp-jshint' ),
    stylish      = require( 'jshint-stylish' ),
    less         = require( 'gulp-less' ),
    concat       = require( 'gulp-concat' ),
    rename       = require( 'gulp-rename' ),

    jshintError  = require( './build/jshint-error' ),

    args         = require( 'minimist' )( process.argv.slice( 2 ) ),

    DEBUG        = args.d || false,
    BUILD_ERROR  = false;


/**
 * Runs tests
 */
gulp.task( 'test', function() {
    return gulp
        .src( [
            'spec/**/*.js',
            '!spec/fixtures/**/*',
            '!spec/expected/**/*',
            '!spec/utils/**/*'
        ])
        .pipe( plumber( {
            errorHandler: notify.onError( 'Test error: <%= error.message %>' )
        }))
        .pipe( mocha({
            reporter: 'nyan',
            ui: 'tdd'
        }))
        .on( 'error', function( err ) {
            gutil.log( gutil.colors.red( err.message ) );
            BUILD_ERROR = true;
            this.emit( 'end' );
            process.exit( -1 );
        });
});


/**
 * Removes the distribution target directory
 */
gulp.task( 'clean', function() {
    return gulp
        .src([
            './dist/**/*'
        ], { read: false } )
        .pipe( rimraf() );
});


/**
 * Hints the code in core and reports errors
 * ---
 * Lint errors are non-fatal
 */
gulp.task( 'lint', function() {
    return gulp
        .src([
            './lib/*.js',
            './public/scripts/*.js'
        ])
        .pipe( plumber({
            errorHandler: notify.onError( 'Script error: <%= error.message %>' )
        }))
        .pipe( jshint() )
        .pipe( jshint.reporter( stylish ) )
        .pipe( jshintError() )
        .on( 'error', function( err ) {
            BUILD_ERROR = true;
            this.emit( 'end' );
            // process.exit( -1 );
        });
});


/**
 * Converts less to css
 */
gulp.task( 'styles', function() {
    return gulp
        .src([
            './public/stylesheets/main.less'
        ])
        .pipe( plumber({
            errorHandler: notify.onError( 'Stylesheet error: <%= error.message %>' )
        }))
        .pipe( less({
            compress: !DEBUG,
            paths: [ path.join( __dirname, './public/stylesheets' ) ]
        }))
        .pipe( concat( 'styles.css' ) )
        .pipe( gulp.dest( './dist/public/styles/' ) );
});


/**
 * Copies static app stuff into dist
 */
gulp.task( 'copy', function() {
    return gulp
        .src( './public/index.html' )
        .pipe( gulp.dest( './dist/public/' ) );
});


/**
 * Copies the server over to dist
 */
gulp.task( 'copy-server', function() {
    return gulp
        .src([
            './bin/*',
            './lib/**/*'
        ], { base: './' } )
        .pipe( gulp.dest( './dist/' ) )
})


/**
 * Lints the code first, then pipes it through browserify
 * ---
 * `gulp build -d` will output debug info from browserify.
 */
gulp.task( 'build', [ 'lint' ], function() {
    return gulp
        .src( './public/scripts/main.js' )
        .pipe( plumber( {
            errorHandler: notify.onError( 'Build error: <%= error.message %>' )
        }))
        .pipe( browserify({
            debug: DEBUG
        }))
        .on( 'error', function( err ) {
            BUILD_ERROR = true;
            this.emit( 'end' );
            // process.exit( -1 );
        })
        .pipe( gulpif( !DEBUG, uglify() ) )
        .pipe( gulp.dest( './dist/public/scripts' ) );
});



/**
 * Cleans, tests, lints and builds code
 * ---
 */
gulp.task( 'default', [ 'clean', 'test' ], function() {
    gulp.start(
        'build',
        'styles',
        'copy',
        'copy-server',
        function() {
            if ( DEBUG ) {
                gutil.log( gutil.colors.yellow( 'DEBUG build' ) );
            }

            if ( !BUILD_ERROR ) {
                gulp.src( './', { read: false } )
                    .pipe( notify( 'Build Success ✔' ) );

                return;
            }

            gutil.log( gutil.colors.red( 'Built with errors' ) );
        });
});
