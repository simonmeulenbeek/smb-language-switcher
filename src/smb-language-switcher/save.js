/**
 * This is save function returns null, because it's entirely rendered server-side, and
 * therefore doesn't need to be persisted in the database.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save() {
	return null;
}
