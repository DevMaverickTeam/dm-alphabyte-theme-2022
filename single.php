<?php get_header(); ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<section class="section-intro text-white intro-small title-small" id="section-intro-home"<?php if( has_post_thumbnail() ): ?> style="background-image: url(<?php echo get_the_post_thumbnail_url(get_the_ID(), 'full'); ?>)"<?php endif; ?>>
			<div class="container">
				<div class="hero-block" data-split-by="words">
					<h1 class="mb-0"><?php the_title(); ?></h1>
				</div>
			</div>
		</section>
		<section class="blog-article">
			<div class="container">
				<article class="large-text-block">
					<div class="df-row"> 
						<div class="col-xl-10"> 
							<?php theme_the_excerpt(); ?>
						</div>
					</div>
					<?php if( is_singular('post') ): ?>
						<div class="meta-block"> 
							<div class="df-row df-jcc-md"> 
								<div class="col-md-10 col-xl-8">
									<span class="date">
										<time datetime="<?php echo get_the_date('Y-m-d'); ?>">
											<a href="<?php echo get_date_archive_link() ?>" rel="bookmark">
												<?php the_time( 'M j, Y' ) ?>
											</a>
										</time>
									</span>
									<span class="aurhor-block"><?php _e( 'by', DOMAIN ); ?> <span class="aurhor"><a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>"><?php the_author(); ?></a></span></span>
								</div>
							</div>
						</div>
					<?php endif; ?>
					<div class="df-row"> 
						<div class="col-xl-10"> 
							<hr class="divider">
						</div>
					</div>
				</article>
				<article class="article-content">
					<div class="df-row df-jcc-md"> 
						<div class="col-md-10 col-xl-8"> 
							<div class="article-block">
								<?php the_content(); ?>
							</div>
							<div class="blog-article-meta"> 
								<div class="df-row">
									<?php if( is_singular('post') ): ?>
										<?php if( $author = get_user_meta($post->post_author) ): ?>
											<div class="col-md-6"> 
												<div class="person-card">
													<?php $show_author_image = get_field('show_author_image', 'option');
													if( $show_author_image ): ?>
														<?php if( !empty($author['wp_metronet_image_id'][0]) ): ?>
															<?php $avatar = wp_get_attachment_image_src($author['wp_metronet_image_id'][0], 'thumbnail_70x70'); ?>
															<div class="img-card"> <img src="<?php echo $avatar[0]; ?>" alt="image description" width="70" height="70"></div>
														<?php endif; ?>
													<?php endif; ?>
													<div class="card-body">
														<span class="author-name"><?php if( !empty($author['first_name'][0]) or !empty($author['last_name'][0]) ): echo $author['first_name'][0].' '.$author['last_name'][0]; else: echo $author['nickname'][0]; endif; ?></span>
														<?php if( !empty($author['description'][0]) ): ?>
															<span class="author-bio"><?php echo $author['description'][0]; ?></span>
														<?php endif; ?>
													</div>
												</div>
											</div>
										<?php endif; ?>
									<?php endif; ?>
									<div class="col-md-6"> 
										<!-- This share-component should be styling after implementation-->
										<div class="share-block">
											<span class="share-title"><?php _e( 'Share:', DOMAIN ); ?></span>
											<?php echo do_shortcode('[addtoany]'); ?> 
										</div>
									</div>
								</div>
							</div>
							<?php comments_template(); ?>
						</div>
					</div>
				</article>
			</div>
		</section>
	<?php endwhile; ?>
<?php get_footer(); ?>