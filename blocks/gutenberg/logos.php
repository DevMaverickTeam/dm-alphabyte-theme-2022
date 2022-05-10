<?php /*
Block title: Logos
Description: Logos block.
Keywords: logo
Icon: image-flip-horizontal
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-logos-animated';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php if( $logos = get_field('logos') ): ?>
	<div class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
		<div class="line-box">
			<div class="mask">
				<div class="line">
					<?php foreach( $logos as $item ): ?>
						<div class="logo-holder"><img src="<?php echo $item['logo']['url']; ?>" alt="<?php echo( $item['logo']['alt'] ? $item['logo']['alt'] : 'image description' ); ?>" width="<?php echo $item['logo_width']; ?>" height="<?php echo $item['logo_height']; ?>"></div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>