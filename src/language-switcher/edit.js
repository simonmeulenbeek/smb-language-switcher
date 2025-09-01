/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const language_switcher_data = window.SMBLanguageSwitcherData || {};
const languages_list = Object.entries(language_switcher_data.languages).sort((a, b) => a.order - b.order);

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
*/
export default function Edit({attributes, setAttributes}) {
	const language_list_items = languages_list.map((language) => {
		let language_code, language_obj;
		[language_code, language_obj] = language
		return ( 
			<li className='wp-block-smb-language-switcher__language' key={language_obj.id}>
				<a>
					{ attributes.display != "names" ? (
						<img className="wp-block-smb-language-switcher__language__flag" src={language_obj.flag}></img>
						) : ("")
					}
					
					{ attributes.display != "flags" ? (
						<p className='wp-block-smb-language-switcher__language__label'>
							{language_obj.name}
						</p>
						) : ("")
					}
				</a>
			</li>
	)});
	
	let classes = 'wp-block-smb-language-switcher';
	switch (attributes.direction) {
		case "vertical":
			classes += ' wp-block-smb-language-switcher--vertical';
			break;
		
		case "horizontal":
		default:
			classes += ' wp-block-smb-language-switcher--horizontal';
	}
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'smb-language-switcher')}>
					<SelectControl
						label={__('Direction', 'smb-language-switcher')}
						value={attributes.direction}
						options={[
							{label: 'Horizontal', value: 'horizontal'},
							{label: 'Vertical', value: 'vertical'}
						]}
						onChange={(value) => {setAttributes({direction: value})}}
					/>
					<SelectControl
						label={__('Display', 'smb-language-switcher')}
						value={attributes.display}
						options={[
							{label: 'Flags', value: 'flags'},
							{label: 'Names', value: 'names'},
							{label: 'Both', value: 'both'}
						]}
						onChange={(value) => {setAttributes({display: value})}}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps({className: classes}) }>
				<ul className='wp-block-smb-language-switcher__languages' role='list'>
					{language_list_items}
				</ul>
			</div>
		</>
	);
}