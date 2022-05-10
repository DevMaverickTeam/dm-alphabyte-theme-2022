<?php /*
Block title: One column text
Description: One column text block.
Keywords: one, column, text
Icon: editor-justify
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-working-with-us';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className']; 
} ?>
<?php global $i; $i++; ?>
<?php $title = get_field('title');
$text = get_field('text');
if( !empty($title) or !empty($text) ): ?>
    <section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
        <div class="container">
            <?php if( $title ): ?>
                <div class="section-header viewport-block">
                    <h2><?php echo $title; ?></h2>
                </div>
            <?php endif; ?>
            <?php if( $text ): ?>
                <div class="section-content viewport-block" data-split-by="words">
                    <?php echo $text; ?>
                </div>
            <?php endif; ?>
        </div>
    </section>
<?php endif; ?>