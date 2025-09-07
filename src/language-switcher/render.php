<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
if (!function_exists('pll_the_languages')) {
    $error = __('Polylang not active', 'error-polylang-active', 'smb-language-switcher');
    echo '<p class="polylang-error">' . esc_html($error) . '</p>';
} else {
    $languages = pll_the_languages(array( 'raw' => 1, 'post_id' => get_the_ID()));
    $translations = array_filter($languages, function($item) {
        return !$item["no_translation"];
    });
    
    $count = count($translations);
    $component_classes = "wp-block-smb-language-switcher";
    if($attributes["direction"] ?? "horizontal" == "vertical") {
        $component_classes .= " wp-block-smb-language-switcher--vertical";
    } else {
        $component_classes .= " wp-block-smb-language-switcher--horizontal";
    }
    if ( $count <= 1) {
        echo "";
    } else {
        ob_start();
        ?>
        <div <?php echo get_block_wrapper_attributes(array("class" => $component_classes)); ?>>
            <ul class="wp-block-smb-language-switcher__languages">
                <?php foreach ($translations as $language): ?>
                    <?php
                    $list_item_classes = 'wp-block-smb-language-switcher__language';
                    if ($language["current_lang"]) {
                        $list_item_classes .= ' wp-block-smb-language-switcher__language--selected';
                    }
                    ?>
                    <li class="<?php echo esc_attr($list_item_classes); ?>">
                        <a class="wp-block-smb-language-switcher__language__anchor" href="<?php echo esc_attr($language["url"]); ?>">
                            
                            
                            <?php if(($attributes["display"] ?? "both") != "names"): ?>
                                <img class="wp-block-smb-language-switcher__language__flag" src="<?php echo esc_attr($language["flag"]); ?>"
                            <?php endif; ?>
                            
                            <?php if(($attributes["display"] ?? "both") != "flags"): ?>
                                <p class="wp-block-smb-language-switcher__language__label">
                                    <?php echo esc_html($language["name"]); ?>
                                </p>
                            <?php endif; ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php
        echo ob_get_clean(); 
    }
}