<?php get_header(); ?>
	<section class="section-blog" id="section-blog"> 
		<div class="container">
			<?php if( $blog_page_id = get_option('page_for_posts') ): ?>
				<div class="section-header">
					<h3><?php echo get_the_title($blog_page_id); ?></h3>
				</div>
			<?php endif; ?>
			<?php if ( have_posts() ) : ?>
				<div class="posts-wrapper">
					<?php while ( have_posts() ) : the_post(); ?>
						<?php get_template_part( 'blocks/content', get_post_type() ); ?>
					<?php endwhile; ?>
				</div>
				<?php get_template_part( 'blocks/pager' ); ?>
			<?php else : ?>
				<?php get_template_part( 'blocks/not_found' ); ?>
			<?php endif; ?>
		</div>
	</section>
<?php get_footer(); ?>