<?php get_header(); ?>
	<section class="section-blog" id="section-blog"> 
		<div class="container">
			<?php if ( have_posts() ) : ?>
				<div class="section-header">
					<?php the_archive_title( '<h3>', '</h3>' ); ?>
				</div>
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