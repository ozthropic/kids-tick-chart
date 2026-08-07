// util.js — tiny shared helpers.

export function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// "Sam" -> "Sam’s", "Silas" -> "Silas’"
export function possessive(name) {
  return name + (/s$/i.test(name) ? '’' : '’s');
}
