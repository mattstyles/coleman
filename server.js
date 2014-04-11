/**
 * Coleman.
 * Your very own personal manbot.
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 * Main server entry point
 */


var http         = require('http'),
    path         = require('path'),
    express      = require('express'),
    favicon      = require('static-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),

    app          = express();


/**
 * Views
 */
app.set( 'views', path.join( __dirname, './lib/views' ) );
app.set( 'view engine', 'hjs' );

/**
 * Middleware
 */
app.use( favicon() );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'app') ) );


/**
 * Set routes
 */
app.get( '/api', require( './lib/routes/api' ) );


/**
 * 404
 */
app.use( function( req, res, next ) {
    var err = new Error( 'Not Found' );
    err.status = 404;
    res.status( err.status );
    next( err );
});


/**
 * Error Handlers
 */

// development - will print stacktrace
if ( app.get( 'env' ).match( /dev/ ) ) {
    app.use( function( err, req, res, next ) {
        res.render( 'error', {
            message: err.message,
            error: err
        });
    });
}

// production - no stacktraces leaked to user
app.use( function( err, req, res, next ) {
    res.render( 'error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
