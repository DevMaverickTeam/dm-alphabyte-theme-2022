<?php /*
Block title: Testimonials
Description: Testimonials block.
Keywords: testimonials
Icon: testimonial
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-testimonials';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$testimonials = get_field('testimonials');
if( !empty($title) or !empty($testimonials) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
		<div class="container">
            <?php if( $title ): ?>
                <div class="title-holder viewport-block" data-split-by="words">
                    <h3 class="text-caps"><?php echo $title; ?></h3>
                </div>
            <?php endif; ?>
			<?php if( $testimonials ): ?>
				<div class="section-inner">
					<div class="testimonials-slider">
						<?php foreach( $testimonials as $item ): ?>
							<div class="slick-slide">
								<?php if( !empty($item['company']) or !empty($item['industry']) ): ?>
									<div class="card-header">
										<?php if( !empty($item['company']) ): ?>
											<h6 class="mb-0 text-caps"><?php echo $item['company']; ?></h6>
										<?php endif; ?>
										<?php if( !empty($item['industry']) ): ?>
											<span><?php echo $item['industry']; ?></span>
										<?php endif; ?>
									</div>
								<?php endif; ?>
								<?php if( !empty($item['quote']) ): ?>
									<blockquote>“<?php echo $item['quote']; ?>”</blockquote>
								<?php endif; ?>
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
	</section>
<?php endif; ?>