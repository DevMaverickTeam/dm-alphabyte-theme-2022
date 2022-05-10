<?php /*
Block title: Technologies list
Description: Technologies list block.
Keywords: technologies, list
Icon: editor-ul
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-tech-used';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$list = get_field('list');
if( !empty($title) or !empty($list) ): ?>
    <section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
        <div class="container">
            <div class="section-wrapper viewport-block">
                <?php if( $title ): ?>
                    <div class="section-header viewport-block" data-split-by="words"> 
                        <h3 class="text-caps"><?php echo $title; ?></h3>
                    </div>
                <?php endif; ?>
                <?php if( $list ): ?>
                    <div class="section-content">
                        <div class="list-wrapper">
                            <ul data-split-by="words">
                                <?php $i = 0;
                                $devider = round(count($list)/2);
                                foreach( $list as $item ): ?>
                                    <?php if( $i == $devider ): ?></ul><ul data-split-by="words"><?php endif; ?>
                                    <li class="viewport-block"><?php echo $item['item']; ?></li>
                                <?php $i++; endforeach; ?>
                            </ul>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
<?php endif; ?>