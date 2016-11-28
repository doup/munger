(function ($) {
    $(function () {
        // --------
        // MU FIXED
        // --------
        // Functions
        function init() {
            $('[data-mu-fixed]').each(function () {
                var breakpoints = $(this).data('mu-fixed').split(' ');
                
                // If "large" is defined as target then add also XL and XXL
                if (breakpoints.indexOf('large') != -1 && breakpoints.indexOf('xlarge') == -1) {
                    breakpoints.push('xlarge');
                }
                
                if (breakpoints.indexOf('large') != -1 && breakpoints.indexOf('xxlarge') == -1) {    
                    breakpoints.push('xxlarge');
                }
                
                $(this).data('mu-fixed', breakpoints.join(' '));
                $(this).data('mu-fixed-top', $(this).offset().top);
                
                $(this).removeClass('mu-fixed__element');
            });
            
            removeClasses();
            checkScroll();
        }
        
        function removeClasses() {
            $('body').removeClass('mu-fixed mu-fixed--small mu-fixed--medium mu-fixed--large mu-fixed--xlarge mu-fixed--xxlarge');
        }
        
        function getFixedEl() {
            var fixed = null;
            
            $('[data-mu-fixed]').each(function () {
                var breakpoints = $(this).data('mu-fixed').split(' ');

                if (breakpoints.indexOf(Foundation.MediaQuery.current) != -1) {
                    fixed = $(this);
                }
            });
            
            return fixed;
        }
        
        function checkScroll() {
            var el = getFixedEl();
            
            if ($(window).scrollTop() > +el.data('mu-fixed-top')) {
                $('body').addClass('mu-fixed').addClass('mu-fixed--'+ Foundation.MediaQuery.current);

                if (Foundation.MediaQuery.atLeast('large')) {
                    $('body').addClass('mu-fixed--large');
                }
                
                el.addClass('mu-fixed__element');
                $('main').css('marginTop', el.outerHeight());
            } else {
                removeClasses();
                el.removeClass('mu-fixed__element');
                $('main').css('marginTop', '0');
            }
        }
        
        // Events
        // Re-initialize on breakpoint change
        $(window).on('changed.zf.mediaquery', function () {
            $(window).scrollTop(0);
            init();
        });

        $(window).on('scroll', checkScroll);
        
        // Init
        // Classic hack to wait the event loop/repaint/whatever
        // Otherwise Foundation.MediaQuery.current is not available
        setTimeout(init, 0);
    });
})(window.jQuery);
