<?php /*
Block title: Text half width
Description: Text half width block.
Keywords: half, width, text
Icon: columns
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-career';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$text = get_field('text');
$button = get_field('button');
if( !empty($title) or !empty($text) or !empty($button) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
		<div class="container">
			<div class="section-wrapper">
				<?php if( $title ): ?>
					<div class="section-header">
						<h3 class="text-caps"><?php echo $title; ?></h3>
					</div>
				<?php endif; ?>
				<?php if( !empty($text) or !empty($button) ): ?>
					<div class="section-content"> 
						<?php if( $text ): echo $text; endif; ?>
						<?php if( $button ): ?>
							<div class="btn-holder"><a href="<?php echo $button['url']; ?>" <?php if( isset($button['target']) and !empty($button['target']) ): ?> target="<?php echo $button['target']; ?>"<?php endif; ?> class="btn btn-primary"><?php echo $button['title']; ?></a></div>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>