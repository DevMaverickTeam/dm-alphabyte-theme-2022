<?php
// Theme css & js

function base_scripts_styles() {
	$in_footer = true;
	/*
	 * Adds JavaScript to pages with the comment form to support
	 * sites with threaded comments (when in use).
	 */
	wp_deregister_script( 'comment-reply' );
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply', get_template_directory_uri() . '/js/comment-reply.js', '', '', $in_footer );
	}
	//
	$scheme = is_ssl() ? 'https://' : 'http://';

	// Loads JavaScript file with functionality specific.
	wp_enqueue_script( 'base-script', get_template_directory_uri() . '/js/jquery.main.js', array( 'jquery' ), '', $in_footer );

	// Loads our main stylesheet.
	wp_enqueue_style( 'base-style', get_stylesheet_uri(), array() );
	
	// Implementation stylesheet.
	wp_enqueue_style( 'base-theme', get_template_directory_uri() . '/theme.css', array() );
	
	if( !is_admin() ):
		wp_deregister_script('jquery');
		wp_register_script('jquery', ($scheme."ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"), false, $in_footer);
		wp_enqueue_script('jquery');
	endif;
}
add_action( 'wp_enqueue_scripts', 'base_scripts_styles' );

add_action( 'admin_enqueue_scripts', function(){
	wp_enqueue_script( 'admin-script', get_template_directory_uri() . '/js/jquery.plugins.js', array( 'jquery' ), '', true );
}, 99 );
