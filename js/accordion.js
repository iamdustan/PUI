/*
 * PUI - accordian ui widget
 * div.accordian>div.section>div.header+div.window
 */
PUI.accordion = function ( opt ) {
    var options = {
        selector : 'div.accordion.js-accordion'
      , expanded : 'expanded'
      , collapsed: 'collapsed'
      , iconClass : {
            header          : 'ui-icon-tri-e'
          , headerSelected  : 'ui-icon-tri-s'
        }
    }, accordion,section,header,window;
    
    PUI.utils.extend( options, opt );
    
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
                    .prepend('<span class="ui-icon ' + options.iconClass.header + '">&#8227;</span>')
                    .next('div.window').hide()
                    .parent().addClass( options.collapsed );
                    
            } else {
                $(this)
                    .prepend('<span class="ui-icon ' + options.iconClass.headerSelected + '"></span>');
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
                .find('>div.header>span.ui-icon').removeClass( options.iconClass.header ).addClass( options.iconClass.headerSelected );
        } else {
            $(this)
                .siblings('div.window').hide()
                .parent().removeClass( options.expanded ).addClass( options.collapsed )
                .find('>div.header>span.ui-icon').removeClass( options.iconClass.headerSelected ).addClass( options.iconClass.header );
        }
    });
};
PUI.accordion();