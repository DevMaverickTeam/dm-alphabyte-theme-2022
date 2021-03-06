<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
        <!-- set the viewport width and initial-scale on mobile devices -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <!-- set the encoding of your site -->
		<meta charset="<?php bloginfo( 'charset' ); ?>">
        <!-- include custom JavaScript -->
		<script type="text/javascript">
			var pathInfo = {
				base: '<?php echo get_template_directory_uri(); ?>/',
				css: 'css/',
				js: 'js/',
				swf: 'swf/',
			}
		</script>
		<?php wp_head(); ?>


<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-74059332-1', 'auto');
ga('send', 'pageview');

</script>


	</head>
	<body <?php body_class(); ?>>
        <div id="wrapper">
            <!-- header of the page -->
			<?php if ( is_page() ) {
				$post = get_post(); 
				$blocks = parse_blocks( $post->post_content );
				if ($blocks) {
					if ( $blocks[0]['blockName'] == 'acf/top-banner' ) {
						$classes = 'bg-transparent';
					}
					else {
						$classes = 'bg-white';
					}
				}
				else {
					$classes = 'bg-white';
				}
			}
			elseif( is_single() ){
				$classes = 'bg-transparent';
			}
			else {
				$classes = 'bg-white';
			}?>
            <header class="<?php echo $classes; ?>" id="header">
                <div class="container">
					<div class="header-holder">
						<div class="logo">
							<a href="<?php echo home_url(); ?>">
								<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 223.942 38.734">
									<path data-name="Rectangle 6" d="M30.208 22.495h7.551v7.497h-7.551z"></path>
									<path data-name="Path 1" d="M30.208.005H7.55a7.524 7.524 0 0 0-7.551 7.5v14.99a7.524 7.524 0 0 0 7.551 7.5h15.1v-7.5H7.55V7.502h15.1v14.993h7.551V.005Z"></path>
									<path data-name="Path 2" d="M55.386 0 43.777 29.992h5.871l2.589-6.984H63.89l2.59 6.983h5.914L60.737 0Zm-1.338 18.209L58.106 7.24l4.056 10.969Z"></path>
									<path data-name="Rectangle 7" d="M73.252 0h5.265v29.992h-5.265z"></path>
									<path data-name="Path 3" d="M92.846 8.055a7.846 7.846 0 0 0-6.56 3.042v-2.7h-5.265v30.338h5.265v-11.1a7.56 7.56 0 0 0 6.172 2.7c6.388 0 10.487-4.542 10.487-11.14s-3.841-11.14-10.099-11.14Zm-.994 17.739c-3.582 0-5.914-2.615-5.914-6.6s2.33-6.6 5.914-6.6c3.5 0 5.827 2.615 5.827 6.6s-2.331 6.6-5.827 6.6Z"></path>
									<path data-name="Path 4" d="M116.932 8.055c-3.108 0-5.61 1.329-6.819 3.684V0h-5.265v29.992h5.265V18.209c0-3.171 2.114-5.484 5.049-5.484 2.72 0 4.575 2.056 4.575 5.013v12.256h5.265V16.626c0-5.058-3.194-8.571-8.07-8.571Z"></path>
									<path data-name="Path 5" d="M136.592 8.055c-5.653 0-9.323 3.342-9.582 7.627h4.748c.086-1.928 1.769-3.684 4.575-3.684s4.446 1.5 4.446 3.6a1.4 1.4 0 0 1-1.6 1.457h-4.013c-4.877 0-8.157 2.615-8.157 6.812 0 3.727 2.935 6.47 7.25 6.47 3.108 0 5.61-1.414 6.517-3.556v3.214h5.222V16.113c.003-4.887-3.881-8.058-9.406-8.058Zm4.187 12.811c0 3.256-1.942 5.569-5.265 5.569-1.985 0-3.366-1.115-3.366-2.786 0-1.885 1.511-3.128 3.754-3.128h4.877Z"></path>
									<path data-name="Path 6" d="M160.156 8.055a7.738 7.738 0 0 0-6.388 2.957V0h-5.265v29.992h5.265v-2.7a7.52 7.52 0 0 0 6.3 3.042c6.517 0 10.357-4.542 10.357-11.14s-3.842-11.139-10.269-11.139Zm-.862 17.739c-3.539 0-5.871-2.615-5.871-6.6s2.33-6.6 5.871-6.6 5.871 2.615 5.871 6.6-2.333 6.6-5.871 6.6Z"></path>
									<path data-name="Path 7" d="M196.969 22.238v-9.426h6.04V8.398h-6.04V1.885h-5.308v6.513h-7.032l-5.006 14.825-5.049-14.825h-5.395l7.942 21.594-3.065 8.742h5.053l3.363-9.769 5.966-16.153h3.226v9.641c0 4.8 3.108 7.542 7.855 7.542h3.5v-4.458h-2.892c-1.995 0-3.158-1.114-3.158-3.299Z"></path>
									<path data-name="Path 8" d="M218.764 22.794c-.56 2.056-2.33 3.171-5.049 3.171-3.366 0-5.61-2.227-6-5.7h16.055c.043-.428.086-1.072.086-1.8 0-5.141-3.28-10.411-10.575-10.411-7.12 0-10.659 5.355-10.659 11.055 0 5.657 3.97 11.226 11.092 11.226 5.351 0 9.409-2.957 10.228-7.542Zm-5.483-10.8a4.972 4.972 0 0 1 5.265 4.8h-10.7c.558-3.259 2.457-4.798 5.435-4.798Z"></path>
								</svg>
							</a>
						</div>
						<nav id="nav"><a class="nav-opener" href="#"></a>
							<div class="nav-drop">
								<div class="nav-drop-header"> 
									<div class="logo">
										<a href="<?php echo home_url(); ?>">
											<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 223.942 38.734">
												<path data-name="Rectangle 6" d="M30.208 22.495h7.551v7.497h-7.551z"></path>
												<path data-name="Path 1" d="M30.208.005H7.55a7.524 7.524 0 0 0-7.551 7.5v14.99a7.524 7.524 0 0 0 7.551 7.5h15.1v-7.5H7.55V7.502h15.1v14.993h7.551V.005Z"></path>
												<path data-name="Path 2" d="M55.386 0 43.777 29.992h5.871l2.589-6.984H63.89l2.59 6.983h5.914L60.737 0Zm-1.338 18.209L58.106 7.24l4.056 10.969Z"></path>
												<path data-name="Rectangle 7" d="M73.252 0h5.265v29.992h-5.265z"></path>
												<path data-name="Path 3" d="M92.846 8.055a7.846 7.846 0 0 0-6.56 3.042v-2.7h-5.265v30.338h5.265v-11.1a7.56 7.56 0 0 0 6.172 2.7c6.388 0 10.487-4.542 10.487-11.14s-3.841-11.14-10.099-11.14Zm-.994 17.739c-3.582 0-5.914-2.615-5.914-6.6s2.33-6.6 5.914-6.6c3.5 0 5.827 2.615 5.827 6.6s-2.331 6.6-5.827 6.6Z"></path>
												<path data-name="Path 4" d="M116.932 8.055c-3.108 0-5.61 1.329-6.819 3.684V0h-5.265v29.992h5.265V18.209c0-3.171 2.114-5.484 5.049-5.484 2.72 0 4.575 2.056 4.575 5.013v12.256h5.265V16.626c0-5.058-3.194-8.571-8.07-8.571Z"></path>
												<path data-name="Path 5" d="M136.592 8.055c-5.653 0-9.323 3.342-9.582 7.627h4.748c.086-1.928 1.769-3.684 4.575-3.684s4.446 1.5 4.446 3.6a1.4 1.4 0 0 1-1.6 1.457h-4.013c-4.877 0-8.157 2.615-8.157 6.812 0 3.727 2.935 6.47 7.25 6.47 3.108 0 5.61-1.414 6.517-3.556v3.214h5.222V16.113c.003-4.887-3.881-8.058-9.406-8.058Zm4.187 12.811c0 3.256-1.942 5.569-5.265 5.569-1.985 0-3.366-1.115-3.366-2.786 0-1.885 1.511-3.128 3.754-3.128h4.877Z"></path>
												<path data-name="Path 6" d="M160.156 8.055a7.738 7.738 0 0 0-6.388 2.957V0h-5.265v29.992h5.265v-2.7a7.52 7.52 0 0 0 6.3 3.042c6.517 0 10.357-4.542 10.357-11.14s-3.842-11.139-10.269-11.139Zm-.862 17.739c-3.539 0-5.871-2.615-5.871-6.6s2.33-6.6 5.871-6.6 5.871 2.615 5.871 6.6-2.333 6.6-5.871 6.6Z"></path>
												<path data-name="Path 7" d="M196.969 22.238v-9.426h6.04V8.398h-6.04V1.885h-5.308v6.513h-7.032l-5.006 14.825-5.049-14.825h-5.395l7.942 21.594-3.065 8.742h5.053l3.363-9.769 5.966-16.153h3.226v9.641c0 4.8 3.108 7.542 7.855 7.542h3.5v-4.458h-2.892c-1.995 0-3.158-1.114-3.158-3.299Z"></path>
												<path data-name="Path 8" d="M218.764 22.794c-.56 2.056-2.33 3.171-5.049 3.171-3.366 0-5.61-2.227-6-5.7h16.055c.043-.428.086-1.072.086-1.8 0-5.141-3.28-10.411-10.575-10.411-7.12 0-10.659 5.355-10.659 11.055 0 5.657 3.97 11.226 11.092 11.226 5.351 0 9.409-2.957 10.228-7.542Zm-5.483-10.8a4.972 4.972 0 0 1 5.265 4.8h-10.7c.558-3.259 2.457-4.798 5.435-4.798Z"></path>
											</svg>
										</a>
									</div>
								</div>
								<?php if( has_nav_menu( 'primary' ) )
								wp_nav_menu( array(
										'container' => false,
										'theme_location' => 'primary',
										'menu_id'        => 'navigation',
										'menu_class'     => 'primary-menu',
										'items_wrap'     => '<ul class="%2$s">%3$s</ul>',
										'walker'         => new Custom_Walker_Nav_Menu
									)
								); ?>
								<?php if( $button = get_field('button', 'option') ): ?>
									<div class="btn-holder"><a href="<?php echo $button['url']; ?>" <?php if( isset($button['target']) and !empty($button['target']) ): ?> target="<?php echo $button['target']; ?>"<?php endif; ?> class="btn btn-default"><?php echo $button['title']; ?></a></div>
								<?php endif; ?>
							</div>
						</nav>
					</div>
                </div>
            </header>
            <!-- contain main informative part of the site -->
            <main id="main">
