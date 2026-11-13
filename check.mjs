import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { RegionSnap, createScreenCapture, html2canvasRenderer } from '@region-snap/vue'

assert.equal(RegionSnap.name, 'RegionSnap')
assert.equal(typeof createScreenCapture, 'function')
assert.equal(typeof html2canvasRenderer, 'function')
const packageInfo = JSON.parse(readFileSync(new URL('./node_modules/@region-snap/vue/package.json', import.meta.url)))
assert.equal(packageInfo.version, '0.1.1')
const lock = JSON.parse(readFileSync(new URL('./package-lock.json', import.meta.url)))
assert.match(lock.packages['node_modules/@region-snap/vue'].resolved, /^https:\/\/registry\.npmjs\.org\//)
assert.match(lock.packages['node_modules/@region-snap/core'].resolved, /^https:\/\/registry\.npmjs\.org\//)
console.log('Published npm package and ESM exports: PASS')

const translations = JSON.parse(readFileSync(new URL('./src/translations.json', import.meta.url)))
for (const [key, values] of Object.entries(translations)) {
  assert.equal(values.length, 7, `Missing language for: ${key}`)
  assert.ok(values.every(value => typeof value === 'string' && value.trim()), `Empty translation: ${key}`)
}
for (const file of ['docs.zh-CN.md', 'docs.en.md']) {
  const markdown = readFileSync(new URL(`./src/${file}`, import.meta.url), 'utf8')
  const headings = [...markdown.matchAll(/^## (.+)$/gm)].map(match => match[1].trim())
  assert.equal(headings.length, 11)
  assert.equal(headings[4], 'API')
}
console.log(`Eight-language UI (${Object.keys(translations).length} phrases) and bilingual documentation: PASS`)
