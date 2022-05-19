<?php get_header(); ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<?php //the_post_thumbnail( 'full' ); ?>
		<?php the_content(); ?>
		<?php edit_post_link( __( 'Edit', DOMAIN ) ); ?>
	<?php endwhile; ?>
	<?php wp_link_pages(); ?>
	<?php comments_template(); ?>
<?php get_footer(); ?>
