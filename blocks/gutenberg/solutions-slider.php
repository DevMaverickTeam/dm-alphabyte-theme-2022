<?php /*
Block title: Solutions slider
Description: Solutions slider block.
Keywords: solution, slider
Icon: images-alt2
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-has-carousel bg-white';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$text = get_field('text');
$image = get_field('image');
$slider = get_field('slider');
if( !empty($title) or !empty($text) or !empty($image) or !empty($slider) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
		<div class="container">
			<?php if( !empty($title) or !empty($text) ): ?>
				<div class="title-holder viewport-block" data-split-by="words">
					<?php if( $title ): ?>
						<h2 class="text-caps"><?php echo $title; ?></h2>
					<?php endif; ?>
					<?php if( $text ): echo $text; endif; ?>
				</div>
			<?php endif; ?>
			<?php if( !empty($image) or !empty($slider) ): ?>
				<div class="section-inner">
					<?php if( !empty($image) ): ?>
						<div class="section-visual has-parallax-image"><img src="<?php echo $image['sizes']['thumbnail_1030x643']; ?>" alt="<?php echo( $image['alt'] ? $image['alt'] : 'image description' ); ?>" width="<?php echo $image['sizes']['thumbnail_1030x643-width']; ?>" height="<?php echo $image['sizes']['thumbnail_1030x643-height']; ?>" data-bottom-top="transform: scale(1.2)" data-top-bottom="transform: scale(1)"></div>
					<?php endif; ?>
					<?php if( !empty($slider) ): ?>
						<div class="section-content">
							<div class="solutions-slider">
								<?php foreach( $slider as $item ): ?>
									<div class="slick-slide">
										<?php if( !empty($item['title']) ): ?>
											<h4><?php echo $item['title']; ?></h4>
										<?php endif; ?>
										<?php if( !empty($item['text']) ): echo $item['text']; endif; ?>
										<?php if( !empty($item['button']) ): ?>
											<div class="btn-holder">
												<a href="<?php echo $item['button']['url']; ?>" <?php if( isset($item['button']['target']) and !empty($item['button']['target']) ): ?> target="<?php echo $item['button']['target']; ?>"<?php endif; ?> class="btn btn-primary"><?php echo $item['button']['title']; ?></a>
											</div>
										<?php endif; ?>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>