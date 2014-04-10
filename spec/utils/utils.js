
module.exports = {

    /**
     * Quick object equality test, assumes that if the keys and values match
     * then the object is equal enough to pass.
     */
    objectIs: function( obj, obj1 ) {
        var flag = true;

        for( key in obj ) {
            if ( obj[ key ].toString() !== obj1[ key ].toString() ) {
                flag = false;
            }
        }
        for( key in obj1 ) {
            if ( obj1[ key ].toString() !== obj[ key ].toString() ) {
                flag = false;
            }
        }

        return flag;
    },

    /**
     * Buffer equality check
     */
    bufferIs: function( buf, buf1 ) {
        return buf <= buf1 && buf >= buf1;
    }

}
