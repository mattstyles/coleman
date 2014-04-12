


var body = document.querySelector( 'body' ),
    input = document.querySelector( 'input' ),
    ul = document.querySelector( 'ul' );


function addElement( str ) {
    var el = document.createElement( 'li' );
    el.innerHTML = str;
    ul.appendChild( el );
}



input.addEventListener( 'keypress', function( event ) {
    var key = event.which || event.keyCode;

    if ( key === 13 ) {

        addElement( input.value );
        input.value = "";


    }

});


body.addEventListener( 'click', function( event ) {

    input.focus();
});



console.log( 'public' );
