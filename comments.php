<?php

// Do not delete these lines
if ( !empty( $_SERVER['SCRIPT_FILENAME'] ) && 'comments.php' == basename( $_SERVER['SCRIPT_FILENAME'] ) )
	die ( 'Please do not load this page directly. Thanks!' );

if ( post_password_required() ) {
	?> <p><?php _e( 'This post is password protected. Enter the password to view comments.', DOMAIN ); ?></p> <?php
	return;
}
	
function theme_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment; ?>
	
	<div class="commentlist-item">
		<div <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
			<div class="avatar-holder"><?php echo get_avatar( $comment, 48 ); ?></div>
			<div class="commentlist-holder">
				<?php edit_comment_link( __( '(Edit)', DOMAIN ), '<p class="edit-link">', '</p>' ); ?>
				<p class="meta"><a href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>"><?php comment_date( 'F d, Y' ); ?> <?php _e( 'at', DOMAIN ); ?> <?php comment_time( 'g:i a' ); ?></a>, <?php comment_author_link(); ?> <?php _e( 'said:', DOMAIN ); ?></p>
				<?php if ( $comment->comment_approved == '0' ) : ?>
				<p><?php _e( 'Your comment is awaiting moderation.', DOMAIN ); ?></p>
				<?php else : ?>
				<?php comment_text(); ?>
				<?php endif; ?>
				
				<?php
				comment_reply_link( array_merge( $args, array(
					'reply_text' => __( 'Reply', DOMAIN ),
					'before'     => '<p>',
					'after'      => '</p>',
					'depth'      => $depth,
					'max_depth'  => $args['max_depth'],
				) ) ); ?>
			</div>
		</div>
	<?php }
	
	function theme_comment_end() { ?>
		</div>
	<?php }
?>

<?php if ( have_comments() ) : ?>
	<div class="section comments" id="comments">
		<h2><?php comments_number( __('No Responses', DOMAIN ), __( 'One Response', DOMAIN ), __( '% Responses', DOMAIN ) );?> <?php _e( 'to', DOMAIN ); ?> &#8220;<?php the_title(); ?>&#8221;</h2>
		<div class="commentlist">
			<?php wp_list_comments( array(
				'callback'     => 'theme_comment',
				'end-callback' => 'theme_comment_end',
				'style'        => 'div',
			) ); ?>
		</div>
		<?php if( $comments_links = paginate_comments_links( array( 'echo' => false ) ) ): ?>
		<div class="navigation-comments">
			<?php echo $comments_links; ?>
		</div>
		<?php endif; ?>
	</div>
<?php endif; ?>

<?php if ( comments_open() ) : ?>
	<div class="section respond">
		<?php comment_form(); ?>
	</div>
<?php endif; ?>