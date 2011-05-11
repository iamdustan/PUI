(function( $ ) {
$.fn.accordion = function( method ) {
    var methods // public methods
      , helpers // private methods
      , section, header, window;
    methods = {
        init : function( options ) { // this the constructor method that gets called when the object is created
            var settings = this.accordion.settings = $.extend({}, this.accordion.defaults, options)

            return this.each(function () {
                var $self = $(this),
                    self = this;
                // this == div.accordion
                $self.addClass('accordion');
                section = $self.find('>div.section, >section');
                header = section.find('>div.header, >header');
                window = section.find('>div.window');

                if ( settings.masterControls ) {
                    $self.prepend('<div class="accordion-tools"><span class="collapse-all">Hide all</span><span class="expand-all">Show all</span></div>');
                    $self.find('>div.accordion-tools').delegate('span', 'click', function( e ) {
                        var $btn = $(this);
                        if ( $btn.hasClass('collapse-all') ) {
                            helpers.collapseAll( header, settings );
                        } else if ( $btn.hasClass('expand-all') ) {
                            helpers.expandAll( header, settings );
                        }
                    });
                }

                header.each(function () {
                    var $self = $(this);
                    if ( !$self.parent().hasClass( settings.expandedClass ) ) {
                        $self.prepend('<span class="ui-icon ' + settings.iconClass.collapsed + '"></span>')
                            .next('div.window').hide()
                            .parent().addClass( settings.collapsedClass );
                    } else {
                        $self.prepend('<span class="ui-icon ' + settings.iconClass.expanded + '"></span>');
                    }
                });
                header.bind('click', function () {
                    $(this).next('div.window').toggle()
                        .parent().toggleClass( settings.collapsedClass ).toggleClass( settings.expandedClass )
                    header.find('>span.ui-icon').toggleClass( settings.iconClass.expanded ).toggleClass( settings.iconClass.collapsed );
                });
            });
        }
    }

    helpers = {
        collapseAll : function( header, settings ) {
            return header.each(function () {
                if ( $(this).parent().hasClass( settings.expandedClass ) ) {
                    $(this).click();
                }
            });
        },
        expandAll: function( header, settings ) {
            return header.each(function () {
                if ( $(this).parent().hasClass( settings.collapsedClass ) ) {
                    $(this).click();
                }
            });
        }
    }

    // if a method as the given argument exists
    if( methods[method] ) {                              // call the respective method
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if( typeof method === 'object' || !method ) { // if an object is given as method OR nothing is given as argument call the initialization method
        return methods.init.apply( this, arguments );
    } else {                                            // otherwise trigger an error
        $.error( 'Method "' +  method + '" does not exist in the JRM Accordion widget.');
    }
};

$.fn.accordion.defaults = { // plugin's default options
    expandedClass : 'expanded'
  , collapsedClass: 'collapsed'
  , iconClass : {
        collapsed : 'ui-icon-tri-e'
      , expanded  : 'ui-icon-tri-s'
    }
  , masterControls: false
}
$.fn.accordion.settings = {};

})( jQuery );