<?php /*
Block title: Team
Description: Team block.
Keywords: team
Icon: groups
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-team';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$team = get_field('team');
if( !empty($title) or !empty($team) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
		<div class="container">
            <?php if( $title ): ?>
                <div class="section-header">
                    <h3 class="text-caps"><?php echo $title; ?></h3>
                </div>
            <?php endif; ?>
            <?php if( $team ): ?>
                <ul class="team-list">
                    <?php $col_count = round(count($team)/4); ?>
                    <li class="team-col">
                        <?php $i = 0; foreach( $team as $item ): ?>
                            <?php if( $i%$col_count == 0 and $i != 0 ): ?></li><li class="team-col"><?php endif; ?>
                            <div class="open-close">
                                <?php if( !empty($item['name']) or !empty($item['position']) ): ?>
                                    <a class="opener" href="#">
                                        <?php if( !empty($item['name']) ): ?>
                                            <h3><?php echo $item['name']; ?></h3>
                                        <?php endif; ?>
                                        <?php if( !empty($item['position']) ): ?>
                                            <span><?php echo $item['position']; ?></span>
                                        <?php endif; ?>
                                    </a>
                                <?php endif; ?>
                                <?php if( !empty($item['photo']) ): ?>
                                    <div class="slide">
                                        <div class="img-holder">
                                            <img src="<?php echo $item['photo']['sizes']['thumbnail_280x339']; ?>" alt="<?php echo( $item['photo']['alt'] ? $item['photo']['alt'] : 'image description' ); ?>" width="<?php echo $item['photo']['sizes']['thumbnail_280x339-width']; ?>" height="<?php echo $item['photo']['sizes']['thumbnail_280x339-height']; ?>">
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php $i++; endforeach; ?>
                    </li>
                </ul>
            <?php endif; ?>
		</div>
	</section>
<?php endif; ?>