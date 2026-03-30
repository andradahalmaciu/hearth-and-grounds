/**
 * Triggers a file download from a Blob in the browser.
 * Kept separate from api.js so the service layer stays free of DOM side-effects.
 */
export function downloadBlob(blob, filename) {
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}
