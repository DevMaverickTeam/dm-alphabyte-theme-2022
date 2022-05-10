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
        //Your js code
		jQuery(".testimonials-slider").slick({
			slidesToScroll: 1,
			slidesToShow: 4,
			rows: 0,
			infinite: true,
			arrows: false,
			dots: true,
			prevArrow: '<button type="button" class="slick-prev"><span class="icon-chevron-left"></span></button>',
			nextArrow: '<button type="button" class="slick-next"><span class="icon-chevron-right"></span></button>',
			responsive: [{
				breakpoint: 1200,
				settings: {
				  slidesToShow: 3,
				},
			  },
			  {
				breakpoint: 992,
				settings: {
				  slidesToShow: 2,
				},
			  },
			  {
				breakpoint: 768,
				settings: {
				  slidesToShow: 1,
				},
			  },
			],
		  });
    }
    

    // Initialize dynamic block preview (editor).
    if( window.acf ) {
        window.acf.addAction( 'render_block_preview/type=testimonials', initializeBlock );
    }

})(jQuery);
