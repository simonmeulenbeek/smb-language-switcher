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
$languages = [];
if (!function_exists('pll_the_languages')) {
    echo '<p class="polylang-error">Polylang plugin is niet actief</p>';
} else {
    $languages = pll_the_languages(array( 'raw' => 1, 'post_id' => get_the_ID()));
    $translations = array_filter($languages, function($item) {
        return !$item["no_translation"];
    });
    $count = count($translations);
    if (empty($translations) || $count == 1) {
        echo "";
    } else {
        ob_start();
        ?>
        <div class="wp-block-smb-language-switcher">
            <ul class="wp-block-smb-language-switcher__languages">
                <?php foreach ($translations as $language): ?>
                    <?php
                    $classes = 'wp-block-smb-language-switcher__language';
                    if ($language["current_lang"]) {
                        $classes .= ' wp-block-smb-language-switcher__language--selected';
                    }
                    ?>
                    <li class="<?php echo esc_attr($classes); ?>">
                        <a href="<?php echo esc_attr($language["url"]); ?>">
                            <img class="wp-block-smb-language-switcher__language__flag" src="<?php echo esc_attr($language["flag"]); ?>"
                            <p class="wp-block-smb-language-switcher__language__label">
                                <?php echo esc_html($language["name"]); ?>
                            </p>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php
        echo ob_get_clean();   
    }
}