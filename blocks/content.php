<a class="blog-post" href="<?php the_permalink(); ?>">
	<div class="post-header">
		<?php the_title( '<h6 class="post-title">', '</h6>' ); ?>
		<?php the_excerpt(); ?>
	</div>
	<div class="post-footer">
		<div class="img-holder"><?php the_post_thumbnail('thumbnail_580x300'); ?></div>
		<div class="btn-holder"><span class="btn btn-primary"><?php _e( 'Read More', DOMAIN ); ?></span></div>
	</div>
</a>
