(function($){

    /**
     * initializeBlock
     *
     * Adds custom JavaScript to the block HTML.
     *
     * @date    15/4/19
     * @since   1.0.0
     *
     * @param   object $block The block jQuery element.
     * @param   object attributes The block attributes (only available when editing).
     * @return  void
     */
    var initializeBlock = function( $block ) {
        jQuery(".solutions-slider").slick({
			slidesToScroll: 1,
			slidesToShow: 1,
			rows: 0,
			autoplay: false,
			infinite: true,
			autoplaySpeed: 15000,
			fade: true,
			cssEase: "linear",
			pauseOnFocus: false,
			pauseOnHover: false,
			arrows: true,
			dots: true,
			prevArrow: '<button type="button" class="slick-prev"><span class="icon-chevron-left"></span></button>',
			nextArrow: '<button type="button" class="slick-next"><span class="icon-chevron-right"></span></button>',
		  });
    }
    

    // Initialize dynamic block preview (editor).
    if( window.acf ) {
        window.acf.addAction( 'render_block_preview/type=solutions-slider', initializeBlock );
    }

})(jQuery);
