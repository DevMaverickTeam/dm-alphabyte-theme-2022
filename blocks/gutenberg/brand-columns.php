<?php /*
Block title: Brand columns
Description: Brand columns block.
Keywords: brand
Icon: analytics
Other Available options: Icon, Category.
*/ ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$button = get_field('button');
$my_posts = get_field('posts');
$type = get_field('type');
$text = get_field('text');
if( $type == 'text' ):
     $className = 'section-summary';
else:
    $className = 'section-brand-values bg-gray';
endif;
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
}
if( !empty($title) or !empty($button) or !empty($my_posts) or !empty($text) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>"> 
		<div class="container">
			<?php if( !empty($title) or !empty($button) ): ?>
				<div class="section-header viewport-block" data-split-by="words">
                    <?php if( $type == 'text' ): ?>
                        <?php if( $text ): ?>
                            <div class="header-text">
                                <?php echo $text; ?>
                            </div>
                        <?php endif; ?>
                        <?php if( $button ): ?>
                            <div class="btn-holder"><a href="<?php echo $button['url']; ?>" <?php if( isset($button['target']) and !empty($button['target']) ): ?> target="<?php echo $button['target']; ?>"<?php endif; ?> class="btn btn-primary"><?php echo $button['title']; ?></a></div>
                        <?php endif; ?>
                    <?php elseif( $title ): ?>
                        <h2><?php echo $title; ?></h2>
                    <?php endif; ?>
				</div>
			<?php endif; ?>
			<?php if( !empty($my_posts) ): ?>
				<div class="<?php echo( $button ? 'section-content' : 'section-inner' ); ?>">
					<?php foreach( $my_posts as $item ): ?>
						<div class="brand-item viewport-block" data-split-by="words">
							<?php if( !empty($item['title']) ): ?>
								<h5 class="item-title"><?php echo $item['title']; ?></h5>
							<?php endif; ?>
							<?php if( !empty($item['text']) ): echo $item['text']; endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>