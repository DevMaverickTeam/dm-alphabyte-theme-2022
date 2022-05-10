<?php /*
Block title: Offices open-close
Description: Offices open-close block.
Keywords: open-close, offices
Icon: table-col-after
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-main section-accordion';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $image = get_field('image');
$title = get_field('title');
$desc = get_field('description');
$offices = get_field('offices');
if( !empty($image) or !empty($title) or !empty($desc) or !empty($offices) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>"> 
		<div class="container">
			<div class="df-row">
				<?php if( !empty($image) ): ?>
					<div class="col-md-6"> 
						<div class="df-row"> 
							<div class="col-xl-11 col-xxl-10"> 
								<div class="img-holder has-parallax-image"> 
									<picture>
										<source type="image/jpeg" srcset="<?php echo $image['sizes']['thumbnail_342x358']; ?>" media="(max-width: 767px)">
										<source type="image/jpeg" srcset="<?php echo $image['sizes']['thumbnail_800x950']; ?>" media="(min-width: 768px)">
										<img src="<?php echo $image['sizes']['thumbnail_800x950']; ?>" alt="image description" width="800" height="950"  data-bottom-top="transform: scale(1.2)" data-top-bottom="transform: scale(1)">
									</picture>
								</div>
							</div>
						</div>
					</div>
				<?php endif; ?>
				<?php if( !empty($title) or !empty($desc) or !empty($offices) ): ?>
					<div class="col-md-6"> 
						<div class="section-accordion-holder">
							<?php if( !empty($title) or !empty($desc) ): ?>
								<div class="section-accordion-block">
									<?php if( $title ): ?>
                                        <div class="section-accordion-title viewport-block" data-split-by="words">
											<h2><?php echo $title; ?></h2>
										</div>
                                    <?php endif; ?>
									<?php if( $desc ): ?>
										<div class="df-row"> 
											<div class="col-xl-8"> 
												<p><?php echo $desc; ?></p>
											</div>
										</div>
									<?php endif; ?>
								</div>
							<?php endif; ?>
							<?php if( $offices ): ?>
								<div class="accordion-container"> 
									<ul class="accordion">
										<?php foreach( $offices as $item ): ?>
											<li>
												<a class="accordion-opener" href="#"> 
													<h3><?php echo $item['title']; ?></h3>
												</a>
												<?php if( !empty($item['address']) ): ?>
													<div class="accordion-slide">
														<address><?php echo $item['address']; ?></address>
													</div>
												<?php endif; ?>
											</li>
										<?php endforeach; ?>
									</ul>
								</div>
							<?php endif; ?>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>