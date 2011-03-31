/*
 * WLIB - Slideshow widget
 * div.js-slideshow>div.tools+div.image-wrapper
 */
(function client_slideshow () {
    WLIB.slideshow = function (elem, obj) {
        var ss = elem || $('.js-slideshow')
          , btn = {
                prev : ss.find('a.prev')
              , next : ss.find('a.next')
              , slideshow : ss.find('a.slideshow')
            }
          , counter = ss.find('small.current-image')
          , images = ss.find('.image-wrapper>img')
          , tslider = ss.find('.thumbs>.tslider')
          , thumbs = tslider.find('>a')
          , state = {};
        
        images.filter(':not(:first-child)').css({'opacity' : 0}).hide();
        
        // initial state
        state['playing'] = false;
        state['visible'] = images.filter(':first');
        state['vindex']  = state['visible'].index()+1;
        
        // general functions
        function updateCounter () {
            counter.text( state['vindex'] + ' / ' + images.length );
        };
        function updateThumbs () {
            thumbs.removeClass('selected').filter(':nth-child(' + state['vindex'] + ')').addClass('selected');
        };

        btn['prev'].bind('click', function( e ) {
            e.preventDefault();
            state['visible'].stop().animate({ 'opacity' : 0 }, function () {
                var self = $(this);
                self.hide();
                if ( self.prev().length > 0 ) {
                    state['visible'] = self.prev();
                } else {
                    state['visible'] = images.filter(':last');
                }
                state['vindex'] = state['visible'].index()+1;
                updateCounter();
                updateThumbs();
                state['visible'].show().stop().animate({'opacity' : 1});
            });
        });

        btn['next'].bind('click', function (e) {
            e.preventDefault();
            state['visible'].stop().animate({ 'opacity' : 0 }, function () {
                var self = $(this);
                self.hide();
                if ( self.next().length > 0 ) {
                    state['visible'] = self.next();
                } else {
                    state['visible'] = images.filter(':first');
                }
                state['vindex'] = state['visible'].index()+1;
                updateCounter();
                updateThumbs();
                state['visible'].show().stop().animate({'opacity' : 1});
            });
        });

        thumbs.bind('click', function( e ) {
            e.preventDefault();
            var self = $(this)
              , ind = self.index();
            thumbs.filter('.selected').removeClass('selected');
            self.addClass('selected');
            
            var cur = state['visible'];
            
            state['visible'] = images.filter(':nth-child(' + (+ind+1) + ')');
            state['vindex'] = state['visible'].index()+1;
            
            cur.stop().animate({ 'opacity' : 0 }, function () {
                $(this).hide();
                updateCounter();
                state['visible'].show().stop().animate({'opacity' : 1});
            });
        });
        
        (function () {
            var t;
            function slideshow () {
                btn['next'].trigger('click');
                t = setTimeout(slideshow, 3000);
            };
            btn['slideshow'].bind('click', function( e ) {
                if ( state.playing === false ) {
                    state.playing = true;
                    $(this).addClass('playing');
                    slideshow();
                } else {
                    state.playing = false;
                    $(this).removeClass('playing');
                    clearTimeout( t );
                };
            });
        })();

        $(function thumbnailSlider () {
            var lp = 0
              , down = false
              , mw = 0
              , iw = $('.thumbs').innerWidth() - Math.floor( parseInt( $('.thumbs').css('paddingLeft')) /2 );
              
            thumbs.find('>img').each(function () {
                var self = $(this);
                self.load(function () {
                    log( self.parent().outerWidth() );
                    mw += self.parent().outerWidth();
                });
            });
            tslider.parent().delegate('a', 'mousedown', function( e ) {
                down = true;
                var self = $(this);
                if ( tslider.css('left') == 'auto' ) { tslider.css('left', lp + 'px' ); }
                if ( self.hasClass('slideLeft') ) {
                    if ( lp+40 < 0 ) { lp += 40; }
                    else { lp = 0 }
                } else if ( self.hasClass('slideRight') ) {
                    if ( lp-40 > iw-mw ) { lp -= 40; }
                    else { lp = 0-mw+iw }
                }
                
                tslider.animate({
                    'left': lp + 'px'
                }, 100, function () {
                    setTimeout(function() {
                        if( down ) { self.trigger('mousedown') };
                    }, 1);
                });
            }).delegate('a', 'mouseup', function( e ) {
                down = false;
            });
        });

        counter.text( '1 / ' + images.length );
    };
    WLIB.slideshow();
})();
