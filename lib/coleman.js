/**
 * Coleman.
 * Your very own personal manbot.
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 */

var http         = require( 'http' ),
    path         = require( 'path' ),

    express      = require( 'express' ),
    favicon      = require( 'static-favicon' ),
    logger       = require( 'morgan' ),
    cookieParser = require( 'cookie-parser' ),
    bodyParser   = require( 'body-parser' ),
    debug        = require( 'debug' )( 'coleman' ),

    _            = require( 'lodash-node' ),

    modules      = require( './modules' );


module.exports = {

    /**
     * The express instance
     */
    app: express(),


    /**
     * Initialise coleman - mainly just sets up express
     */
    init: function( imports ) {

        /**
         * Initialise modules
         */
        imports.callFn( 'init' );

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

        /**
         * Add module static paths
         */
        // Add module static paths
        imports.callFn( 'static' );
        // Add default static path
        this.addStaticPath( path.join( __dirname, '../public' ) );


        /**
         * Set routes
         */
        imports.callFn( 'router' );
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


    /**
     * Runs initialisation functions and starts up the app
     */
    start: function() {

        modules.import( this )
            .then( _.bind( this.init, this ) )
            .then( _.bind( function() {

                var server = this.app.listen( this.app.get( 'port' ), function() {
                    debug( 'Express server listening on port ' + server.address().port );
                });

            }, this ))
            .catch( function( err ) {
                debug( 'Error importing modules' );
                debug( err );
            });
    },


    /**
     * Adds core routes
     */
    router: function( application ) {

        var app = application || this.app;

        app.get( '/api', require( './routes/api' ) );
    },


    /**
     * Adds a path to be searched when serving static stuff
     */
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
