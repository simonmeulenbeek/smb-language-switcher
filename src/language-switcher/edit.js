import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Notice,
	RadioControl,
} from '@wordpress/components';

/** Import editor.scss so it's get processed by webpack */
import './editor.scss';

const languageSwitcherData = window.SMBLanguageSwitcherData || {};
const error =
	'error' in languageSwitcherData ? languageSwitcherData.error : false;
const languagesList = error
	? []
	: Object.entries( languageSwitcherData.languages ).sort(
			( a, b ) => a.order - b.order
	  );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   attributes               Object containing Block attributes defined in block.json
 * @param {Object}   attributes.attributes    Dictionary with current attribute values.
 * @param {Function} attributes.setAttributes Function that allows updating Block attributes.
 * @return 	{Element} 								Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	let errorMessage;
	switch ( error ) {
		case 'polylang-inactive':
			errorMessage = __(
				"This block requires plugin 'Polylang' to be installed and activated.",
				'smb-language-switcher'
			);
			break;
		default:
			errorMessage = __(
				'Unknown error occured.',
				'smb-language-switcher'
			);
	}

	const languageListItems = error ? (
		<span>{ errorMessage }</span>
	) : (
		languagesList.map( ( language ) => {
			const [ _, languageObj ] = language;
			return (
				<li
					className="wp-block-smb-language-switcher__language"
					key={ languageObj.id }
				>
					<a
						className="wp-block-smb-language-switcher__language__anchor"
						href={ languageObj.url }
					>
						{ attributes.display !== 'names' ? (
							<img
								className="wp-block-smb-language-switcher__language__flag"
								src={ languageObj.flag }
								alt={ languageObj.name }
							></img>
						) : (
							''
						) }

						{ attributes.display !== 'flags' ? (
							<p className="wp-block-smb-language-switcher__language__label">
								{ languageObj.name }
							</p>
						) : (
							''
						) }
					</a>
				</li>
			);
		} )
	);

	let classes = 'wp-block-smb-language-switcher';
	switch ( attributes.direction ) {
		case 'vertical':
			classes += ' wp-block-smb-language-switcher--vertical';
			break;

		case 'horizontal':
		default:
			classes += ' wp-block-smb-language-switcher--horizontal';
	}
	return (
		<>
			<InspectorControls>
				{ error ? (
					<Notice
						status="error"
						politeness="polite"
						actions={ [
							{
								label: 'Open Polylang plugin page',
								onClick: () => {
									// eslint-disable-next-line no-undef
									tb_show(
										'Polylang Plugin',
										languageSwitcherData.install_link
									);
								},
							},
						] }
					>
						{ errorMessage }
					</Notice>
				) : (
					''
				) }
				<PanelBody title={ __( 'Settings', 'smb-language-switcher' ) }>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						disabled={ error }
						label={ __( 'Direction', 'smb-language-switcher' ) }
						value={ attributes.direction }
						options={ [
							{
								label: __(
									'Horizontal',
									'smb-language-switcher'
								),
								value: 'horizontal',
							},
							{
								label: __(
									'Vertical',
									'smb-language-switcher'
								),
								value: 'vertical',
							},
						] }
						onChange={ ( value ) => {
							setAttributes( { direction: value } );
						} }
					/>
					<RadioControl
						disabled={ error }
						label={ __( 'Display', 'smb-language-switcher' ) }
						selected={ attributes.display ?? 'both' }
						options={ [
							{
								label: __( 'Both', 'smb-language-switcher' ),
								value: 'both',
							},
							{
								label: __( 'Flags', 'smb-language-switcher' ),
								value: 'flags',
							},
							{
								label: __( 'Names', 'smb-language-switcher' ),
								value: 'names',
							},
						] }
						onChange={ ( value ) => {
							setAttributes( { display: value } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps( { className: classes } ) }>
				<ul className="wp-block-smb-language-switcher__languages">
					{ languageListItems }
				</ul>
			</div>
		</>
	);
}
