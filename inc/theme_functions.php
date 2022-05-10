<?php
// Theme functions

//Add class on body
add_filter( 'body_class', 'custom_class' );
function custom_class( $classes ) {
    if ( is_page() ) {
        $post = get_post(); 
        $blocks = parse_blocks( $post->post_content );
        if ($blocks) {
            $start = substr($blocks[0]['blockName'], 0, 3);
            if ( $start == 'acf' ) {
                $classes[] = 'no-space';
            }
        }
    }
    elseif( is_blog() or is_single() or is_search() or is_archive() ) {
        $classes[] = 'no-space';
    }
    return $classes;
}

// Add is_blog function
function is_blog () {
    return ( is_archive() || is_author() || is_category() || is_home() || is_single() || is_tag()) && 'post' == get_post_type();
}

function wpdocs_custom_excerpt_length( $length ) {
    return 40;
}
add_filter( 'excerpt_length', 'wpdocs_custom_excerpt_length', 999 );

function wpdocs_excerpt_more( $more ) {
    return '...';
}
add_filter( 'excerpt_more', 'wpdocs_excerpt_more' );