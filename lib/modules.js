/**
 * Responsible for importing modules
 */


var fs = require( 'fs' ),
    path = require( 'path' ),

    Promise = require( 'es6-promise' ).Promise,
    _ = require( 'lodash-node' );


module.exports = {

    /**
     * Array of modules
     * @type Array
     */
    mods: [],


    /**
     * Helper to get the environment build type
     */
    getEnv: function( matcher ) {
        if ( !process.env.NODE_ENV ) {
            return false;
        }

        return process.env.NODE_ENV.match( matcher );
    },


    /**
     * Imports all modules from the modules folder and instantiates registering coleman
     * @param coleman {Object} core instance
     * @returns Promise - resolves after requiring modules passing back itself
     */
    import: function( coleman ) {

        var modulepath = this.getEnv( /dev/ ) ? '../modules' : '../../modules',
            self = this;

        function include( filepath ) {
            self.mods.push( require( filepath )( coleman ) );
        }

        return new Promise( function( resolve, reject ) {

            fs.readdir( path.join( __dirname, modulepath ), function( err, files ) {
                if ( err ) {
                    reject( err );
                    return;
                }

                // Require each module
                files.forEach( function( mod ) {
                    include( path.join( __dirname, modulepath, mod ) );
                });

                resolve( self );
            });

        });
    },


    /**
     * Calls a function on the imported module if it exists
     * @param fn {string} the function to call
     */
    callFn: function( fn ) {

        this.mods.forEach( function( mod ) {

            if ( mod[ fn ] ) {
                mod[ fn ]();
            }
        });
    }



};
