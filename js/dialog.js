/*
 * WLIB - Dialog Overlay
  */
(function( $ ){
var defaults = {
    // create defaults.
    modal : true
  , target: undefined
}

init = function () {
    var dialogContainer = $('<div />', {
        id  :  'dialogContainer'
    });
    $('body').append(dialogContainer);
};


var methods = {
    init : function( options ) {
        log( options);
        return this.each(function () {
            $(this).detach();
        });
    },
    destroy : function () {
        return this.each(function () {
            $(window).unbind('.tooltip');
        });
    },
    open : function( options ) {
        return this.each(function () {
            // do stuff here
        });
    },
    close : function( options ) {
        return this.each(function () {
            
        });
    }
    // to do — additional 
};

$.fn.dialog = function( method, options ) {
    if ( !method ) {
        return methods.init.apply( this, Array.prototype.slice.call( arguments, 1 ) );
    } else if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
    } else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.dialog' );
    }
};


$(function(){init();});
})( jQuery );

jQuery(function() {
    $('button.dialog-trigger').bind('click', function (e) {
        self.dialog( 'open', {
            modal : true    
          , target: ( self.data('target') != '' ) ? self.data('target') : self
        });
    });
});