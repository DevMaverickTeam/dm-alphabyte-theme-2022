<?php /*
Block title: Full width image
Description: Full width image block.
Keywords: full, width, image
Icon: align-full-width
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-img-full-width';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php if( $image = get_field('image') ): ?>
	<div class="<?php echo esc_attr($className); ?>  has-parallax-image" id="section-<?php echo $i; ?>">
		<img src="<?php echo $image['url']; ?>" alt="<?php echo( $image['alt'] ? $image['alt'] : 'image description' ); ?>" data-bottom-top="transform: scale(1.2)" data-top-bottom="transform: scale(1)">
	</div>
<?php endif; ?>