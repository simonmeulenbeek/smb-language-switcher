/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	Notice,
	RadioControl,
} from "@wordpress/components";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

const language_switcher_data = window.SMBLanguageSwitcherData || {};
const error =
	"error" in language_switcher_data ? language_switcher_data.error : false;
const languages_list = error
	? []
	: Object.entries(language_switcher_data.languages).sort(
			(a, b) => a.order - b.order,
	  );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	let error_msg;
	switch (error) {
		case "polylang-inactive":
			error_msg = __(
				"This block requires plugin 'Polylang' to be installed and activated.",
				"smb-language-switcher",
			);
			break;
		default:
			error_msg = __("Unknown error occured.", "smb-language-switcher");
	}

	const language_list_items = error ? (
		<span>{error_msg}</span>
	) : (
		languages_list.map((language) => {
			let language_obj;
			[_, language_obj] = language;
			return (
				<li
					className="wp-block-smb-language-switcher__language"
					key={language_obj.id}
				>
					<a className="wp-block-smb-language-switcher__language__anchor">
						{attributes.display != "names" ? (
							<img
								className="wp-block-smb-language-switcher__language__flag"
								src={language_obj.flag}
							></img>
						) : (
							""
						)}

						{attributes.display != "flags" ? (
							<p className="wp-block-smb-language-switcher__language__label">
								{language_obj.name}
							</p>
						) : (
							""
						)}
					</a>
				</li>
			);
		})
	);

	let classes = "wp-block-smb-language-switcher";
	switch (attributes.direction) {
		case "vertical":
			classes += " wp-block-smb-language-switcher--vertical";
			break;

		case "horizontal":
		default:
			classes += " wp-block-smb-language-switcher--horizontal";
	}
	return (
		<>
			<InspectorControls>
				{error ? (
					<Notice
						status="error"
						politeness="polite"
						actions={[
							{
								label: "Open Polylang plugin page",
								onClick: () => {
									tb_show(
										"Polylang Plugin",
										language_switcher_data.install_link,
									);
								}
							}
						]}
					>
						{error_msg}
					</Notice>
				) : (
					""
				)}
				<PanelBody title={__("Settings", "smb-language-switcher")}>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						disabled={error}
						label={__("Direction", "smb-language-switcher")}
						value={attributes.direction}
						options={[
							{
								label: __(
									"Horizontal",
									"smb-language-switcher",
								),
								value: "horizontal",
							},
							{
								label: __("Vertical", "smb-language-switcher"),
								value: "vertical",
							},
						]}
						onChange={(value) => {
							setAttributes({ direction: value });
						}}
					/>
					<RadioControl
						disabled={error}
						label={__("Display", "smb-language-switcher")}
						selected={attributes.display ?? "both"}
						options={[
							{
								label: __("Both", "smb-language-switcher"),
								value: "both",
							},
							{
								label: __("Flags", "smb-language-switcher"),
								value: "flags",
							},
							{
								label: __("Names", "smb-language-switcher"),
								value: "names",
							},
						]}
						onChange={(value) => {
							setAttributes({ display: value });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps({ className: classes })}>
				<ul
					className="wp-block-smb-language-switcher__languages"
					role="list"
				>
					{language_list_items}
				</ul>
			</div>
		</>
	);
}
