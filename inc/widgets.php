<?php

//Custom widget Recent Posts From Specific Category
class Widget_Recent_Posts_From_Category extends WP_Widget {

	function __construct() {
		$widget_ops = array(
				'classname' => 'widget_recent_entries_from_category',
				'description' => __( 'The most recent posts from specific category on your site', DOMAIN ),
				);
		parent::__construct( 'recent-posts-from-category', __( 'Recent Posts From Specific Category', DOMAIN ), $widget_ops );
		$this->alt_option_name = 'widget_recent_entries_from_category';
		
		add_action( 'save_post',    array( &$this, 'flush_widget_cache' ) );
		add_action( 'deleted_post', array( &$this, 'flush_widget_cache' ) );
		add_action( 'switch_theme', array( &$this, 'flush_widget_cache' ) );
	}

	function widget( $args, $instance ) {
		$cache = wp_cache_get( 'widget_recent_posts_from_category', 'widget' );
		
		if ( !is_array( $cache ) )
			$cache = array();
		
		if ( isset( $cache[$args['widget_id']] ) ) {
			echo $cache[$args['widget_id']];
			return;
		}
		
		ob_start();
		extract( $args );
		
		$title = apply_filters( 'widget_title', empty( $instance['title'] ) ? __( 'Recent Posts', DOMAIN ) : $instance['title'], $instance, $this->id_base );
		if ( ! $number = absint( $instance['number'] ) )
			$number = 10;
		
		$r = new WP_Query( array(
					'posts_per_page'      => $number,
					'no_found_rows'       => true,
					'post_status'         => 'publish',
					'ignore_sticky_posts' => true,
					'cat'                 => $instance['cat'],
					)
				);
		if ( $r->have_posts() ) :
		?>
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		<ul>
		<?php  while ( $r->have_posts() ) : $r->the_post(); ?>
		<li><a href="<?php the_permalink() ?>" title="<?php echo esc_attr( get_the_title() ? get_the_title() : get_the_ID() ); ?>"><?php if ( get_the_title() ) the_title(); else the_ID(); ?></a></li>
		<?php endwhile; ?>
		</ul>
		<?php echo $after_widget; ?>
		<?php
		wp_reset_postdata();
		
		endif;
		
		$cache[$args['widget_id']] = ob_get_flush();
		wp_cache_set( 'widget_recent_posts_from_category', $cache, 'widget' );
	}

	function update( $new_instance, $old_instance ) {
		$instance           = $old_instance;
		$instance['title']  = strip_tags( $new_instance['title'] );
		$instance['number'] = (int) $new_instance['number'];
		$instance['cat']    = (int) $new_instance['cat'];
		$this->flush_widget_cache();
		
		$alloptions = wp_cache_get( 'alloptions', 'options' );
		if ( isset( $alloptions['widget_recent_entries_from_category'] ) )
			delete_option( 'widget_recent_entries_from_category' );
		
		return $instance;
	}

	function flush_widget_cache() {
		wp_cache_delete( 'widget_recent_posts_from_category', 'widget' );
	}

	function form( $instance ) {
		$title	= isset( $instance['title'] )  ? esc_attr( $instance['title'] ) : '';
		$number	= isset( $instance['number'] ) ? absint( $instance['number'] ) : 5;
		$cat	= isset( $instance['cat'] )    ? $instance['cat'] : 0;
		?>
<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', DOMAIN ); ?></label>
<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>

<p>
<label>
<?php _e( 'Category', DOMAIN ); ?>:
<?php wp_dropdown_categories( array( 'name' => $this->get_field_name("cat"), 'selected' => $cat ) ); ?>
</label>
</p>

<p><label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of posts to show:', DOMAIN ); ?></label>
<input id="<?php echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="text" value="<?php echo $number; ?>" size="3" /></p>
<?php
	}
}
function recent_posts_from_category_init_widget ()
{
    return register_widget('Widget_Recent_Posts_From_Category');
}
add_action ('widgets_init', 'recent_posts_from_category_init_widget');

//Custom widget Socials
class Widget_Socials extends WP_Widget {

	function __construct() {
		$widget_ops = array(
				'classname' => 'widget_socials',
				'description' => __( 'The social links on your site', DOMAIN ),
				);
		parent::__construct( 'socials', __( 'Socials', DOMAIN ), $widget_ops );
		$this->alt_option_name = 'widget_socials';
		
		add_action( 'save_post',    array( &$this, 'flush_widget_cache' ) );
		add_action( 'deleted_post', array( &$this, 'flush_widget_cache' ) );
		add_action( 'switch_theme', array( &$this, 'flush_widget_cache' ) );
	}

	function widget( $args, $instance ) {
		$cache = wp_cache_get( 'widget_socials', 'widget' );
		
		if ( !is_array( $cache ) )
			$cache = array();
		
		if ( isset( $cache[$args['widget_id']] ) ) {
			echo $cache[$args['widget_id']];
			return;
		}
		
		ob_start();
		extract( $args );
		
		$title = apply_filters( 'widget_title', empty( $instance['title'] ) ? __( 'Contact info', DOMAIN ) : $instance['title'], $instance, $this->id_base ); ?>
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		<?php if( $socials = get_field('socials', 'widget_' .$args['widget_id']) ): ?>
			<ul class="footer-socials">
				<?php foreach( $socials as $item ): ?>
					<li><a target="_blank" href="<?php echo $item['url']; ?>" class="icon-<?php echo $item['acf_fc_layout']; ?>"></a></li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
		<?php echo $after_widget; ?>
		
		<?php
		$cache[$args['widget_id']] = ob_get_flush();
		wp_cache_set( 'widget_socials', $cache, 'widget' );
	}

	function update( $new_instance, $old_instance ) {
		$instance           = $old_instance;
		$instance['title']  = strip_tags( $new_instance['title'] );
		$this->flush_widget_cache();
		
		$alloptions = wp_cache_get( 'alloptions', 'options' );
		if ( isset( $alloptions['widget_socials'] ) )
			delete_option( 'widget_socials' );
		
		return $instance;
	}

	function flush_widget_cache() {
		wp_cache_delete( 'widget_socials', 'widget' );
	}

	function form( $instance ) {
		$title	= isset( $instance['title'] )  ? esc_attr( $instance['title'] ) : ''; ?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', DOMAIN ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>
		
		
		<?php
	}
}
function socials_init_widget ()
{
    return register_widget('Widget_Socials');
}
add_action ('widgets_init', 'socials_init_widget');

//Custom widget Contacts
class Widget_Contacts extends WP_Widget {

	function __construct() {
		$widget_ops = array(
				'classname' => 'widget_contacts',
				'description' => __( 'The contact info on your site', DOMAIN ),
				);
		parent::__construct( 'contacts', __( 'Contact info', DOMAIN ), $widget_ops );
		$this->alt_option_name = 'widget_contacts';
		
		add_action( 'save_post',    array( &$this, 'flush_widget_cache' ) );
		add_action( 'deleted_post', array( &$this, 'flush_widget_cache' ) );
		add_action( 'switch_theme', array( &$this, 'flush_widget_cache' ) );
	} 

	function widget( $args, $instance ) {
		$cache = wp_cache_get( 'widget_contacts', 'widget' );
		
		if ( !is_array( $cache ) )
			$cache = array();
		
		if ( isset( $cache[$args['widget_id']] ) ) {
			echo $cache[$args['widget_id']];
			return;
		}
		
		ob_start();
		extract( $args );
		
		$title = apply_filters( 'widget_title', empty( $instance['title'] ) ? __( 'Contact info', DOMAIN ) : $instance['title'], $instance, $this->id_base ); ?>
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		
		<?php $offices = get_field('offices', 'widget_' .$args['widget_id']);
		$email = get_field('email', 'widget_' .$args['widget_id']);
		if( !empty($offices) or !empty($email) ): ?>
			<ul class="address">
				<?php if( $offices ): ?>
					<?php foreach( $offices as $item ): ?>
						<li>
							<?php if( !empty($item['title']) ): ?>
								<strong><?php echo $item['title']; ?></strong>
							<?php endif; ?>
							<?php if( !empty($item['address']) ): ?>
								<address><?php echo $item['address']; ?></address>
							<?php endif; ?>
						</li>
					<?php endforeach; ?>
				<?php endif; ?>
				<?php if( $email ): ?>
					<li><a href="mailto:<?php echo antispambot($email); ?>"><?php echo antispambot($email); ?></a></li>
				<?php endif; ?>
			</ul>
		<?php endif; ?>
		<?php echo $after_widget; ?>
		
		<?php
		$cache[$args['widget_id']] = ob_get_flush();
		wp_cache_set( 'widget_socials', $cache, 'widget' );
	}

	function update( $new_instance, $old_instance ) {
		$instance           = $old_instance;
		$instance['title']  = strip_tags( $new_instance['title'] );
		$this->flush_widget_cache();
		
		$alloptions = wp_cache_get( 'alloptions', 'options' );
		if ( isset( $alloptions['widget_contacts'] ) )
			delete_option( 'widget_contacts' );
		
		return $instance;
	}

	function flush_widget_cache() {
		wp_cache_delete( 'widget_contacts', 'widget' );
	}

	function form( $instance ) {
		$title	= isset( $instance['title'] )  ? esc_attr( $instance['title'] ) : ''; ?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', DOMAIN ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>
		
		
		<?php
	}
}
function contacts_init_widget ()
{
    return register_widget('Widget_Contacts');
}
add_action ('widgets_init', 'contacts_init_widget');


