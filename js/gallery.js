/*
 * WLIB - Slideshow widget
 * div.js-slideshow>div.tools+div.image-wrapper+div.thumbs
 *
 * TODO // add lightbox functionality
 */
(function slideshowClosure () {
    WLIB.slideshow = function (elem, obj) {
        var ss = elem || $('.js-slideshow')
          , tools = ss.find('.tools')
          , btn = {
                prev : ss.find('a.prev')
              , next : ss.find('a.next')
              , slideshow : ss.find('a.slideshow')
            }
          , counter = ss.find('small.current-image')
          , images = ss.find('.image-wrapper>img')
          , tcont = ss.find('.thumbs')
          , tslider = ss.find('.thumbs>.tslider')
          , thumbs = tslider.find('>a')
          , state = {
                playing : false
              , ssTimer : undefined
              , visible : images.filter(':first')
              , vindex : images.filter(':first').index()+1
          },hasThumbs = (tcont.length > 0 ) ? true : false;
        
        images.filter(':not(:first-child)').css({'opacity' : 0}).hide();
        
        if ( images.length <= 1 ) {
            ss.find('div.tools').remove();
            tcont.remove();
        }


        // general functions
        function updateCounter () {
            counter.text( state['vindex'] + ' / ' + images.length );
        };
        function updateThumbs () {
            if ( hasThumbs ) {
                var self = thumbs.removeClass('selected').filter(':nth-child(' + state['vindex'] + ')').addClass('selected')
                  , ciLeft, ciWidth, tsliderLeft, optimalLeft;
                ciLeft = self.position().left
                ciWidth = self.outerWidth()
                tsliderLeft = parseInt( tslider.css('left') )
                optimalLeft = -(self.position().left + Math.floor(ciWidth/2) - Math.floor(visibleArea/2));
                
                newLeft = ( optimalLeft < maxLeft ) ?
                        maxLeft :
                        ( optimalLeft > 0 ) ? 0 : optimalLeft;
                tslider.animate({'left':newLeft}, 250);
            }
        };

        
        // All Toolbar Actions
        tools.delegate('a', 'click', function( e ) {
            e.preventDefault();
            var target = $(this);
            function slideshow () {
                btn.next.trigger('click');
                state.ssTimer = setTimeout(slideshow, 3000);
            };
            
            if( target.hasClass('prev') || target.hasClass('next') ) {
                var oldVisible = state['visible'];
                ( target.hasClass('prev') ) ?
                    state['visible'] = ( oldVisible.prev().length > 0 ) ? oldVisible.prev() : images.filter(':last') :
                    state['visible'] = ( oldVisible.next().length > 0 ) ? oldVisible.next() : images.filter(':first');
                state['vindex'] = state['visible'].index()+1;
                updateCounter();
                updateThumbs();
                
                oldVisible.stop().animate({ 'opacity' : 0 }, function () {
                    oldVisible.hide();
                    state['visible'].show().stop().animate({'opacity' : 1});
                });
            } else if ( target.hasClass('slideshow') ) {
                if ( state.playing === false ) {
                    state.playing = true;
                    target.addClass('playing');
                    slideshow();
                } else {
                    state.playing = false;
                    target.removeClass('playing');
                    clearTimeout( state.ssTimer );
                };
            }
        });

        var newLeft = 0
          , down = false
          , mw = 0
          , visibleArea = tcont.innerWidth() - (parseInt( tcont.css('paddingLeft') + tcont.css('paddingLeft') )*2 )
          , maxLeft = visibleArea;//updated as thumbnails loaded
      
        thumbs.find('>img').each(function( e, i ) {
            var self = $(this);
            if ($.browser.msie) {
                setTimeout( (function () {
                    mw += self.parent().outerWidth();
                    maxLeft -= self.parent().outerWidth();
                }), 2000);
            } else {
                self.load(function () {
                    mw += self.parent().outerWidth();
                    maxLeft -= self.parent().outerWidth();
                });
            }
        });

        tslider.parent().delegate('a', 'mousedown', function( e ) {
            down = true;
            var self = $(this);
            if ( tslider.css('left') == 'auto' ) { tslider.css('left', newLeft + 'px' ); }
            if ( self.hasClass('slideLeft') ) {             // right arrow
                newLeft = ( newLeft+40 < 0 ) ? newLeft+40 : 0;
            } else if ( self.hasClass('slideRight') ) {     // left arrow
                newLeft = ( newLeft-40 > maxLeft ) ? newLeft-40 : maxLeft;
            } else {                                        // thumbnail
                var ind = self.index()
                  , cur = state['visible'];

                state['visible'] = images.filter(':nth-child(' + (+ind+1) + ')');
                state['vindex'] = state['visible'].index()+1;
                updateThumbs();
                
                cur.stop().animate({ 'opacity' : 0 }, function () {
                    $(this).hide();
                    updateCounter();
                    state['visible'].show().stop().animate({'opacity' : 1});
                });
            }
            tslider.animate({
                'left': newLeft + 'px'
            }, 100, function () {
                setTimeout(function() {
                    if( down ) { self.trigger('mousedown') };
                }, 1);
            });
        }).delegate('a', 'mouseup', function( e ) {
            down = false;
        });

        counter.text( '1 / ' + images.length );
    };
    WLIB.slideshow();
})();
