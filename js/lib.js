/* Thanks to Paul Irish http://www.html5boilerplate.com for this little logging function */
window.log = function () {
    log.history = log.history || [];
    log.history.push( arguments );
    if( this.console ) {
        console.log( Array.prototype.slice.call(arguments) );
    }
};

var PUI = window.PUI || {};

PUI.utils = {
    /*  Returns base path of url for direct referencing. Also manages localhost state for asp.net development
     *  Return value examples — http://www.jrmracing.com/ || http://localhost:54213/www.source/
     */
    getLocalPath : function () {
        var loc = window.location
          , href = loc.href
          , pathname = loc.pathname
          , pathArray = href.split('/')
          , returnPath = pathArray[0] + '/' + pathArray[1] + '/' + pathArray[2];
        return ( href.indexOf('localhost') != -1 ) ?
            returnPath + '/' + pathArray[3] : 
            returnPath;
    },
    
    /*
     *  Returns true if localhost is in current location path 
     */
    isDevelopment : function () {
        return ( window.location.href.indexOf('localhost') != -1 ) ? true : false;
    },
    extend : function( dest, src ) {e
        for ( var prop in src ) {
            dest[prop] = src[prop];
        }
        return dest;
    }
};



PUI.templates = {
    dialog :
        '<div class="ui-dialog small" style="display: block">' +
        '<div class="ui-dialog-head">' +
            '<a href="" class="close">Close</a></div>' +
        '<div class="ui-dialog-body"></div>' +
        '<div class="ui-dialog-foot"></div>' +
        '</div><div id="blackout"><span>test</span></div>'
};

/*
 * WLIB - accordian ui widget
 * div.accordian>div.section>div.header+div.window
 */
PUI.accordion = function ( opt ) {
    var options = {
        selector : 'div.accordion'
      , expanded : 'expanded'
      , collapsed: 'collapsed'
      , icons : {
            header          : 'ui-icon-tri-e'
          , headerSelected  : 'ui-icon-tri-s'
        }
    }, accordion,section,header,window;
    
    WLIB.utils.extend( options, opt );
    
    (function init () {
        accordion = $( options.selector );
        section = accordion.find('>div.section');
        header = section.find('>div.header');
        window = section.find('>div.window');

        if ( accordion.parents('div.accordion') && !accordion.hasClass('no-super-expand') ) {
            accordion.prepend('<div class="accordion-tools"><span class="collapse-all">Hide all</span><span class="expand-all">Show all</span></div>');
        }

        header.each(function () {
            if ( !$(this).parent().hasClass( options.expanded ) ) {
                $(this)
                    .prepend('<span class="ui-icon ' + options.icons.header + '"></span>')
                    .next('div.window').hide()
                    .parent().addClass( options.collapsed );
                    
            } else {
                $(this)
                    .prepend('<span class="ui-icon ' + options.icons.headerSelected + '"></span>');
            }
        });
    })();

    accordion.find('>div.accordion-tools>span.collapse-all').bind('click', function () {
        $(this).parent().siblings('div.section').each(function () {
           if ( $(this).hasClass( options.expanded ) ) {
                $(this).find('>div.header').trigger('click');
            }
        });
    });

    accordion.find('>div.accordion-tools>span.expand-all').bind('click', function () {
        $(this).parent().siblings('div.section').each(function () {
            if ( $(this).hasClass( options.collapsed ) ) {
                $(this).find('>div.header').trigger('click');
            }
        });
    });

    header.click(function () {
        if ( $(this).parent().hasClass( options.collapsed ) ) {
            $(this)
                .siblings('div.window').show()
                .parent().removeClass( options.collapsed ).addClass( options.expanded )
                .find('>div.header>span.ui-icon').removeClass( options.icons.header ).addClass( options.icons.headerSelected );
        } else {
            $(this)
                .siblings('div.window').hide()
                .parent().removeClass( options.expanded ).addClass( options.collapsed )
                .find('>div.header>span.ui-icon').removeClass( options.icons.headerSelected ).addClass( options.icons.header );
        }
    });
};
PUI.accordion();

/*
 * WLIB - tab ui widget
 * div.js-tabs.tabs>ul.tnav+>div.window
 */
PUI.tabs = function ( selector, opt ) {
    var options = {
        selector : selector || '.js-tabs'
      , initial : 1
    };
    WLIB.utils.extend( options, opt );

    $( options.selector ).each(function () {
        var $this = $(this)
          , tabs = $this.find('>ul.tnav>li')
          , window = $this.find('>div.window');
        
        tabs.click(function () {
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
        }).filter( ':nth-child(' + options.initial + ')' ).click();
    });
};
PUI.tabs();


/*
 * WLIB - hide input labels
 * if div.input-wrapper has class .js-label, the label will be hidden on input
 */
PUI.hideLabel = (function () {
    $('div.js-label').find('.input-wrapper input[type=text], .input-wrapper input[type=password]').each(function () {
        var self = $(this)
          , label = self.parents('.input-row').find('label.js-label');
        if ( self.val() == "" ) {
            label.css({ 'visibility': 'visible' });
        };
        $(this).focus(function () {
            if (self.val() == "") {
                if ($.browser.msie) {
                    label.hide();
                } else {
                    label.stop().animate({ opacity: 0.3 }, 350);
                }
            }
        }).keydown(function (e) {
            if ((self.val() == '') && (e.which > 32) && (e.which < 255)) {
                if ( !$.browser.msie ) {
                    label.stop().animate({ opacity: 0 }, 0);    
                }
            }
        }).blur(function () {
            if (self.val() == "") {
                if ($.browser.msie ) {
                    label.show();
                } else {
                    label.css({ 'visibility': 'visible' }).animate({ opacity: 1 }, 500);
                }
            }
        });
    });
})();

/*
 * WLIB - ui star rating
 * div.star-rating is the wrapper around all stars
 * TODO - update this entire thing
 */
PUI.starRating = (function () {
    var star = $('div.star-rating > span.starwrap > a.star')
      , curRating = $('div.star-rating > span.current-rating')
      , crw = parseFloat( $(curRating).text() ) * 20;
    curRating.css({ 'width': crw });
    if (star.hasClass('current')) { $('div.star-rating').find('a.current').prevAll('a.star').addClass('current'); }
    
    star
        .hover(function () { $(this).addClass('hover').prevAll('a.star').addClass('hover');
            }, function () { $(this).removeClass('hover').prevAll('a.star').removeClass('hover');
        }
    );
})();

/*
 * WLIB - Dialog Overlay
 * TODO - update this entire thing
 */
PUI.dialog = function () {
    var _init = function ( ascx ) {
            var dialog = $( WLIB.templates.dialog ).prependTo("body>form")
              , close_btn = dialog.find('a.close')
              , content_area = dialog.find("div.ui-dialog-body")
              , bo = $("#blackout").css({ opacity: 0, display: "block" });
            _open( dialog, content_area, ascx, bo );
            _close( dialog, close_btn, bo );
        },

        _open = function (dialog, content_area, ascx, bo) {
            ascx.appendTo( content_area );
            bo.animate({ opacity: .5 }, 500);

            if (dialog.find("input")) { dialog.find("input:first").focus(); }
        },

        _close = function (dialog, close_btn, bo) {
            $(document).keyup(function (e) { if (e.keyCode === 27) { close_me(); } });
            close_btn.click(function () { close_me(); return false; });
            bo.click(function () { close_me(); });
        
            function close_me () {
                bo.animate({ opacity: 0 }, 100, function () {
                    $(this).remove();
                    dialog.remove();
                });
            }
        };

    (function init() {
        var link = $("a.dialog")
          , ascx = $("#ctl00_ascxHolder>div");        
        
        if ( window.location.hash ){
            var item = window.location.hash.replace('#', '');
            ascx = $('#' + item)
            if ( ascx.hasClass('dialog') ) {
                _init( ascx.clone().removeAttr('style') );
            };
        }

        if ( ascx.find("div.error").length > 0 ) { _init( ascx.removeAttr("style").detach() ); }
        if ( link.not(':disabled') ) {
            link.click(function () {
                if ( $(this).hasClass('dialog-sibling') ) {
                    ascx = $(this).next('div');
                    _init(ascx.clone().removeAttr("style"));
                } else {
                    _init( ascx.removeAttr("style").detach() );
                }
                return false;
            });
        }
    })();
};
PUI.dialog();


/*
 * The only thing I have to say about this is
 * MSIE, I hate you. Every single one of you.
 */
PUI.fileuploader = function () {
    if( $.browser.msie ) {
        return;
    }
    var input = $('.upload-wrapper input[type=file]')
      , fake_input;
    
    input.parents('.upload-wrapper').addClass('fakify');
    input.before('<span class="ui-icon ui-icon-upload"></span><div class="fake_input">Upload new image</div>')
    fake_input = input.siblings('.fake_input');


    input.each(function () {
        $(this).bind('change focus', function( e ) {
            $(this).siblings('div.fake_input').text( $(this).val() );
        });
    });

};
PUI.fileuploader();

/*
 * WLIB - Slideshow widget
 * div.js-slideshow>div.tools+div.image-wrapper
 *
 * There actually is no slideshow part built in yet. And the counter hasn't been implemented yet, either.
 */
PUI.slideshow = function () {
    var s = $('.js-slideshow'),
        prev = s.find('a.prev'),
        next = s.find('a.next'),
        counter = s.find('small.current-image'),
        playing = false;
    
    s.find('>div.image-wrapper img:not(:first)').css({'opacity' : 0}).hide();
    
    function updateCounter () { // really weird counting bug going on here...
        counter.text( (s.find('>div.image-wrapper img:visible').index() + 1) + ' / ' + s.find('img').length );
    };
    
    prev.click(function (e) {
        var img = s.find('>div.image-wrapper img:visible');
        img.stop().animate({ 'opacity' : 0 }, function () {
            img.hide();
            if ( img.prev().length > 0 ) {
                img.prev().show()
                    .stop().animate({'opacity' : 1}, updateCounter);
            } else {
                s.find('>div.image-wrapper img:last').show()
                    .stop().animate({'opacity' : 1}, updateCounter);
            }
        });
        e.preventDefault();
    });

    next.click(function (e) {
        var img = s.find('>div.image-wrapper img:visible');
        img.stop().animate({ 'opacity' : 0 }, function () {
            img.hide();
            if ( img.next().length > 0 ) {
                img.next().show()
                    .stop().animate({'opacity' : 1 }, updateCounter);
            } else {
                s.find('>div.image-wrapper img:first').show()
                    .stop().animate({'opacity' : 1}, updateCounter);
            }
        });
        e.preventDefault();
    });

    updateCounter();
};
PUI.slideshow();