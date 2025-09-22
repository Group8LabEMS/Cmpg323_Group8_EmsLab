/**
 * Util for getting HTML input elements with correct JSDoc type
 * @param {string} id
 * @returns {HTMLInputElement}
 */
export function getInputById(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id ${id} not found`);
  return /** @type {HTMLInputElement} */ (el);
}