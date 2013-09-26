/** 
 *      Document   : jquery.fsvjs.js
 *      Created on : Sep 17, 2013, 4:35:19 PM
 *      Author     : Adam Ludwinski <adam.ludwinski at meant4.com>, Meant4.com
 *      Description:
 *          jQuery plugin for embedding HTML5 video into the website's background using videojs library.
 */
;(function($, window) {
    
    var defaults = {
        start: 0,
        width: $(window).width(),
        ratio: 16/9,
        source: null,
        controls: false,
        autoplay: false,
        preload: 'auto',
        loop: true,
        wrapperZIndex: 1
    };
    
    var fsvjs = function(node, options) {
        var options = $.extend({}, defaults, options);
        
        var fsvjsContainer = $('<div id="fsvjs-container" style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%"><div id="fsvjs-player" style="position: absolute;"></div></div>');
        var videoId = 'videojs-' + $(node).attr('id');
        var videoTag = $('<video></video>').attr({id: videoId}).css({width: '100%'});
        fsvjsContainer.prepend(videoTag);
        
        $('html,body').css({'width': '100%', 'height': '100%'});
        $('body').prepend(fsvjsContainer);
        $(node).css({position: 'relative', zIndex: options.wrapperZIndex});
        
        var playerOptions = {
            controls: options.controls,
            autoplay: options.autoplay,
            preload: options.preload,
            loop: options.loop,
            width: options.width,
            height: Math.ceil(options.width / options.ratio)
        }
        
        // resize handler updates width, height and offset of player after resize/init
        var resize = function() {
            var width = $(window).width(),
                pWidth, // player width, to be defined
                height = $(window).height(),
                pHeight, // player height, tbd
                $fsvjsPlayer = $('#' + videoId);

            $fsvjsPlayer.css({position: 'absolute'});
            // when screen aspect ratio differs from video, video must center and underlay one dimension
            if (width / options.ratio < height) { // if new video height < window height (gap underneath)
                pWidth = Math.ceil(height * options.ratio); // get new player width
                $fsvjsPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0}); // player width is greater, offset left; reset top
            } else { // new video width < window width (gap to right)
                pHeight = Math.ceil(width / options.ratio); // get new player height
                $fsvjsPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2}); // player height is greater, offset top; reset left
            }

        }
        
        window.fsvjsPlayer;
        fsvjsPlayer = videojs('#' + videoId, playerOptions,function () {
            var player = this;
            
            if(options.source != null) {
                this.src(options.source)
            }
            resize();
            
            $(node).trigger('fsvjsPlayerReady', [player]);
            
            this.on('ended', function() {
                if(options.repeat) this.play();
                $(node).trigger('fsvjsEnded', [player]);
            })
            
            this.on('play', function() {
                $(node).trigger('fsvjsPlay', [player]);
            })
        });
        
         $(window).on('resize.fsvjs', function() {
            resize();
        })
    }
    
    $.fn.fsvjs = function (options) {
        return this.each(function () {
            if (!$.data(this, 'fsvjs_instantiated')) { // let's only run one
                $.data(this, 'fsvjs_instantiated', 
                fsvjs(this, options));
            }
        });
    }
    
})(jQuery, window);
