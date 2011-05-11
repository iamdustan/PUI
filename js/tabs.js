(function( $ ) {
$.fn.tabs = function( method ) {
    var methods  // public methods
      , helpers; // private methods
    methods = {
        init : function( options ) { // this the constructor method that gets called when the object is created
            var settings = this.tabs.settings = $.extend({}, this.tabs.defaults, options);

            return this.each(function () {
                var $self = $(this)
                  , self = this
                  , tabs = $self.find('>ul.tnav>li')
                  , window = $self.find('>div.window, section');
                tabs.bind('click', function( e ) {
                    var $this = $(this);//.parent();
                    if ( !($this.hasClass('selected')) ) {
                        tabs.removeClass('selected');
                        $this.addClass('selected');

                        if( window.is(':visible') ) {
                            window.filter(':visible').fadeOut(200, function () {
                                window.eq( $this.index() ).fadeIn();
                            });
                        } else {
                            window.eq( $this.index() ).show();
                        }
                    }
                }).filter( ':nth-child(' + settings.initial + ')' ).click();
            });
        }
    }
    helpers = {}

    if( methods[method] ) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if( typeof method === 'object' || !method ) {
        return methods.init.apply( this, arguments );
    } else {
        $.error( 'Method "' +  method + '" does not exist in the JRM Accordion widget.');
    }
};

$.fn.tabs.defaults = {
    initial : 1
}
$.fn.accordion.settings = {};

})( jQuery );