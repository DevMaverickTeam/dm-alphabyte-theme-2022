<?php
// Theme sidebars

function theme_widget_init() {
	register_sidebar( array(
		'id'            => 'default-sidebar',
		'name'          => __( 'Default Sidebar', DOMAIN ),
		'before_widget' => '<div class="widget %2$s" id="%1$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3>',
		'after_title'   => '</h3>'
	) );
	register_sidebar( array(
		'id'            => 'footer-sidebar',
		'name'          => __( 'Footer Sidebar', DOMAIN ),
		'before_widget' => '<div class="footer-col %2$s" id="%1$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5 class="text-caps">',
		'after_title'   => '</h5>'
	) );
}
add_action( 'widgets_init', 'theme_widget_init' );