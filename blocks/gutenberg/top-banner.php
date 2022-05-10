<?php /*
Block title: Top banner
Description: Top banner block.
Keywords: top, banner
Icon: format-image
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-intro text-white';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $image = get_field('image');
$title = get_field('title');
$arrow = get_field('add_bottom_arrow');
if( !empty($image) or !empty($title) ): ?>
	<section class="<?php echo esc_attr($className); ?><?php if( !$arrow ): echo ' intro-small'; endif; ?>" id="section-<?php echo $i; ?>"<?php if( $image ): ?> style="background-image: url(<?php echo $image['url']; ?>)"<?php endif; ?>>
		<div class="container">
			<?php if( $title ): ?>
				<div class="hero-block viewport-block" data-split-by="words">
					<h1<?php if( !$arrow ): ?> class="mb-0"<?php endif; ?>><?php echo $title; ?></h1>
				</div>
			<?php endif; ?>
            <?php if( $arrow ): ?>
                <a class="btn-scroll-down" href="#section-<?php echo $i+1; ?>"><span class="icon-chevron-down"></span></a>
            <?php endif; ?>
		</div>
	</section>
<?php endif; ?>