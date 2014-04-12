/**
 * Coleman.
 * Your very own personal manbot.
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 */

var http         = require('http'),
    path         = require('path'),

    express      = require('express'),
    favicon      = require('static-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    debug        = require( 'debug' )( 'coleman' ),

    _            = require( 'lodash-node' );



module.exports = {

    app: express(),

    init: function() {

        // for now just manually include linked modules
        var face = require( './../../modules/coleman-face/index.js' )( this );
        face.init();

        /**
         * Views
         */
        this.app.set( 'views', path.join( __dirname, './views' ) );
        this.app.set( 'view engine', 'hjs' );
        debug( 'Views: ' + this.app.get( 'views' ) );

        /**
         * Middleware
         */
        this.app.use( favicon() );
        this.app.use( logger( 'dev' ) );
        this.app.use( bodyParser.json() );
        this.app.use( bodyParser.urlencoded() );
        this.app.use( cookieParser() );

        // Add module static path
        face.static();
        // Add default static path
        this.addStaticPath( path.join( __dirname, '../public' ) );


        /**
         * Set routes
         */
        face.router();
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

        app.get( '/api', require( './routes/api' ) );
    },


    addStaticPath: function( staticPath ) {

        this.app.use( express.static( staticPath ) );
        debug( 'Adding static path: ' + staticPath );
    },


    /**
     * Registers modules/packages
     */
    register: function( module ) {

        debug( 'Registering module: ' + module.getID() );
    }

};
