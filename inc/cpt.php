<?php
// Custom Post Types
add_action('init', 'codex_custom_init');
function codex_custom_init() 
{
  $labels = array(
    'name' => _x('Case Study', 'post type general name'),
    'singular_name' => _x('Case Study', 'post type singular name'),
    'add_new' => _x('Add New', 'Case Study'),
    'add_new_item' => __('Add New Case Study'),
    'edit_item' => __('Edit Case Study'),
    'new_item' => __('New Case Study'),
    'all_items' => __('All Case Studies'),
    'view_item' => __('View Case Study'),
    'search_items' => __('Search Case Studies'),
    'not_found' =>  __('No Case Study found'),
    'not_found_in_trash' => __('No Case Study found in Trash'), 
    'parent_item_colon' => '',
    'menu_name' => 'Case Study'

  );
  $args = array(
    'labels' => $labels,
    'public' => true,
    'publicly_queryable' => true,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
    'capability_type' => 'post',
    'has_archive' => true, 
    'hierarchical' => false,
    'menu_position' => null,
    'supports' => array('title','editor','author','thumbnail','excerpt','comments','custom-fields')
  ); 
  register_post_type('case_study', $args);
  
}
