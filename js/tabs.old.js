(function tabs( selector, opt ) {
    var options = {
        selector : selector || '.js-tabs'
      , initial : 1
    };
    WLIB.utils.extend( options, opt );

    $( options.selector ).each(function () {
        var $this = $(this)
          , tabs = $this.find('>ul.tnav>li')
          , window = $this.find('>div.window');
        
        tabs.bind('click', function ( e ) {
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
    WLIB.tabs = tabs;
})();