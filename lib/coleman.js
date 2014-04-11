/**
 * Due to architecture of how the express server is being created
 * coleman expects to be handed the app during initialisation rather
 * than just require it.
 * This is a bit shit.
 */


var http         = require('http'),
    path         = require('path'),

    express      = require('express'),
    favicon      = require('static-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    debug        = require( 'debug' )( 'coleman' );


module.exports = {

    app: express(),

    init: function() {

        /**
         * Views
         */
        this.app.set( 'views', path.join( __dirname, './views' ) );
        this.app.set( 'view engine', 'hjs' );
        debug( 'Views: ' + path.join( __dirname, './views' ) );

        /**
         * Middleware
         */
        this.app.use( favicon() );
        this.app.use( logger( 'dev' ) );
        this.app.use( bodyParser.json() );
        this.app.use( bodyParser.urlencoded() );
        this.app.use( cookieParser() );
        this.app.use( express.static( path.join( __dirname, '../public' ) ) );
        debug( 'Static using: ' + path.join( __dirname, '../public' ) );


        /**
         * Set routes
         */
        this.router();


        /**
         * 404
         */
        this.app.use( function( req, res, next ) {
            var err = new Error( 'Not Found' );
            err.status = 404;
            res.status( err.status );
            next( err );
        });


        /**
         * Error Handlers
         */
        // development - will print stacktrace
        if ( this.app.get( 'env' ).match( /dev/ ) ) {
            this.app.use( function( err, req, res, next ) {
                res.render( 'error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production - no stacktraces leaked to user
        this.app.use( function( err, req, res, next ) {
            res.render( 'error', {
                message: err.message,
                error: {}
            });
        });

        return this;
    },


    start: function() {

        this.init();

        var server = this.app.listen( this.app.get( 'port' ), function() {
          debug( 'Express server listening on port ' + server.address().port );
        });
    },


    router: function( application ) {

        var app = application || this.app;

        app.get( '/',  require( './routes' ) );
        app.get( '/api', require( './routes/api' ) );
    }

};
