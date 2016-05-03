<?php
/**
 * Plugin Name: Azure Article Updater
 * Description: This plugin adds an trigger that pushes the article to Azure Search on publish and update
 * Author: Elio Struyf
 * Author URI: http://www.eliostruyf.com
 * Version: 1.0
 * License: MIT
 */

/**
 * Azure Article Updater Settings
 */
class Azure_Article_Updater_Plugin {
 
    /**
     * Constructor.
     */
    function __construct() {
		// Register the settings with WordPress.
		add_action( 'admin_init', array( $this, 'aau_admin_settings' ) );

		// Register the settings page within WordPress.
		add_action( 'admin_menu', array( $this, 'aau_admin_menu' ) );
		
		// Register the action trigger
		add_action('transition_post_status', array( $this, 'aau_call_azure_function' ), 10, 3 );
    }
	
	/**
     * Call the Azure Function
     */
	public function aau_call_azure_function ($new_status, $old_status, $post) {
		// Check if the page got published or updated
		if ($new_status == 'publish') {
			// Do a call to the Azure Function URL
			$aau_url = esc_attr(get_option('aau_setting_azure_function_url'));
			if(!empty($aau_url)) {
				$aau_url .= '&postId=' . $post->ID;
				//error_log('AZURE Function URL: ' . $aau_url);
				wp_remote_fopen($aau_url);
			}
		}
	}
	
	/**
     * Registers the settings
     */
	public function aau_admin_settings() {
		// Register the Azure Function setting
		register_setting(
			'aau_settings', // Group name
			'aau_setting_azure_function_url' // Setting name
		);
		
		add_settings_section(
			'aau_settings_section', // ID used to identify this section and with which to register options
			'Azure Article Updater Settings', // Title to be displayed on the administration page
			array($this, 'aau_setting_azure_function_url_display'), // Callback used to render the description of the section
			'aau-admin-settings' // Page on which to add this section of options
		);
	
		add_settings_field(
			'aau_azure_function_url', // ID used to identify the field throughout the theme
			'Azure Function URL:', // The label to the left of the option interface element
			array( $this, 'aau_setting_azure_function_url_setting' ), // The name of the function responsible for rendering the option interface
			'aau-admin-settings', // The page on which this option will be displayed
			'aau_settings_section' // The name of the section to which this field belongs
		);
	}
 
    /**
     * Registers a new settings page under Settings.
     */
    function aau_admin_menu() {
        add_options_page(
            'Azure Article Updater',
            'Azure Article Updater',
            'manage_options',
            'aau-admin-settings',
            array($this, 'aau_settings_page')
        );
    }
 
    /**
     * Settings page display callback.
     */
	function aau_settings_page() {
		?>
		<div class="wrap aau-plugin-wrap">
			<form action="options.php" method="post">
				<?php
					settings_fields(
						'aau_settings' // Settings group name
					);
					do_settings_sections(
						'aau-admin-settings' // Page slug name
					);
					submit_button();
				?>
			</form>
		</div><!--/.wrap-->
		<?php
	}
	
	/*
	* Settings section callback function
	*/
	function aau_setting_azure_function_url_display() {
		echo '<p>Insert the URL of the Azure HttpTrigger Function. This URL will get called when an article is updated or published.</p>';
	}
	
	/*
	* Callback function for our example setting
	*/
	function aau_setting_azure_function_url_setting() {
		$setting = esc_attr( get_option( 'aau_setting_azure_function_url' ) );
		echo "<input type='text' name='aau_setting_azure_function_url' value='$setting' style='width:400px' />";
	}
}

// Initialize the plugin
new Azure_Article_Updater_Plugin;