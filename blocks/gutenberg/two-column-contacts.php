<?php /*
Block title: Two column contacts
Description: Two column contacts block.
Keywords: two, column, contacts
Icon: phone
Other Available options: Icon, Category.
*/ ?>
<?php $className = 'section-main section-contact text-medium-md';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
} ?>
<?php global $i; $i++; ?>
<?php $text = get_field('text');
$phone = get_field('phone');
$email = get_field('email');
$notes = get_field('notes');
$email2 = get_field('email2');
if( !empty($text) or !empty($phone) or !empty($email) or !empty($notes) or !empty($email2) ): ?>
	<section class="<?php echo esc_attr($className); ?>" id="section-<?php echo $i; ?>">
		<div class="container">
			<div class="df-row">
				<?php if( !empty($text) ): ?>
					<div class="col-md-6"> 
						<div class="df-row"> 
							<div class="col-xl-10 col-xxl-8 viewport-block" data-split-by="words"> 
								<?php echo $text; ?>
							</div>
						</div>
					</div>
				<?php endif; ?>
				<?php if( !empty($phone) or !empty($email) or !empty($notes) or !empty($email2) ): ?>
					<div class="col-md-6"> 
						<div class="contact-block viewport-block">
							<?php if( !empty($phone) or !empty($email) ): ?>
								<div class="contact-holder" data-split-by="lines">
									<?php if( !empty($phone) ): ?>
										<dl> 
											<dt><?php _e( 'Call:', DOMAIN ); ?></dt>
											<dd> 
												<?php echo $phone; ?>
											</dd>
										</dl>
									<?php endif; ?>
									<?php if( !empty($email) ): ?>
										<dl> 
											<dt><?php _e( 'Email:', DOMAIN ); ?></dt>
											<dd><a href="mailto:<?php echo antispambot($email); ?>"><?php echo antispambot($email); ?></a></dd>
										</dl>
									<?php endif; ?>
								</div>
							<?php endif; ?>
							<?php if( !empty($notes) or !empty($email2) ): ?>
                                <div data-split-by="lines">
                                    <p><?php echo $notes; ?><?php if( $email2 ): ?> <br> <a href="mailto:<?php echo antispambot($email2); ?>"><?php echo antispambot($email2); ?></a><?php endif; ?></p>
                                </div>
							<?php endif; ?>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>