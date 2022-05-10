<?php /*
Block title: Press
Description: Press block.
Keywords: press
Icon: media-document
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-press';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$logos = get_field('logos');
$my_posts = get_field('posts');
if( !empty($title) or !empty($logos) or !empty($my_posts) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>"> 
		<div class="container">
			<?php if( !empty($title) or !empty($logos) ): ?>
				<div class="section-header">
					<?php if( !empty($title) ): ?>
                        <div class="title viewport-block" data-split-by="words">
                            <h2 class="text-caps mb-0"><?php echo $title; ?></h2>
                        </div>
                    <?php endif; ?>
					<?php if( !empty($logos) ): ?>
						<div class="logos-wrapper viewport-block">
							<?php foreach( $logos as $item ): ?>
								<div class="press-logo"><img src="<?php echo $item['sizes']['thumbnail_317x60']; ?>" alt="<?php echo( $item['alt'] ? $item['alt'] : 'image description' ); ?>" width="<?php echo $item['sizes']['thumbnail_317x60-width']; ?>" height="<?php echo $item['sizes']['thumbnail_317x60-height']; ?>"></div>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
			<?php if( !empty($my_posts) ): ?>
				<div class="section-inner">
					<?php foreach( $my_posts as $item ): ?>
						<div class="blog-post">
							<?php if( !empty($item['title']) ): ?>
								<h6 class="post-title"><a href="<?php echo( $item['button']['url'] ? $item['button']['url'] : '#' ); ?>"><?php echo $item['title']; ?></a></h6>
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
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>