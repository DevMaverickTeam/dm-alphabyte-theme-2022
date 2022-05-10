<?php /*
Block title: Two column (text + image)
Description: Two column (text + image) block.
Keywords: two, column, text, image
Icon: align-pull-right
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-mission';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$text = get_field('text');
$image = get_field('image');
if( !empty($title) or !empty($text) or !empty($image) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
		<div class="container"> 
			<div class="section-inner">
				<?php if( !empty($title) or !empty($text) ): ?>
					<div class="section-content viewport-block" data-split-by="words">
						<?php if( $title ): ?>
						<h3 class="text-caps"><?php echo $title; ?></h3>
					<?php endif; ?>
					<?php if( $text ): echo $text; endif; ?>
					</div>
				<?php endif; ?>
				<?php if( !empty($image) ): ?>
					<div class="section-visual has-parallax-image">
                        <picture>
                            <source type="image/jpeg" srcset="<?php echo $image['sizes']['thumbnail_342x338']; ?>" media="(max-width: 767px)">
                            <source type="image/jpeg" srcset="<?php echo $image['sizes']['thumbnail_1100x762']; ?>" media="(min-width: 768px)">
                            <img src="<?php echo $image['sizes']['thumbnail_1100x762']; ?>" alt="<?php echo( $image['alt'] ? $image['alt'] : 'image description' ); ?>" width="<?php echo $image['sizes']['thumbnail_1030x643-width']; ?>" height="<?php echo $image['sizes']['thumbnail_1030x643-height']; ?>"  data-bottom-top="transform: scale(1.2)" data-top-bottom="transform: scale(1)">
                        </picture>
                    </div>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>