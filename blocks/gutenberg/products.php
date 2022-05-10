<?php /*
Block title: Products
Description: Products block.
Keywords: products
Icon: pressthis
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-products bg-primary';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$text = get_field('text');
$products = get_field('products');
if( !empty($title) or !empty($text) or !empty($products) ): ?>
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
			<?php if( $products ): ?>
				<div class="section-inner">
					<?php foreach( $products as $item ): ?>
						<div class="col">
							<?php if( !empty($item['icon']) or !empty($item['title']) ): ?>
								<div class="product-title">
									<?php if( !empty($item['icon']) ): ?>
										<img src="<?php echo $item['icon']['url']; ?>" alt="<?php echo( $item['icon']['alt'] ? $item['icon']['alt'] : 'image description' ); ?>" width="<?php echo $item['icon_width']; ?>" height="<?php echo $item['icon_height']; ?>">
									<?php endif; ?>
									<?php if( !empty($item['title']) ): ?>
										<h3 class="mb-0"><?php echo $item['title']; ?></h3>
									<?php endif; ?>
								</div>
							<?php endif; ?>
							<?php if( $item['text'] ): echo $item['text']; endif; ?>
							<?php if( !empty($item['button']) ): ?>
								<div class="btn-holder">
									<a href="<?php echo $item['button']['url']; ?>" <?php if( isset($item['button']['target']) and !empty($item['button']['target']) ): ?> target="<?php echo $item['button']['target']; ?>"<?php endif; ?> class="btn btn-default"><?php echo $item['button']['title']; ?></a>
								</div>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>