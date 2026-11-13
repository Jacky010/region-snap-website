import { ref, watch } from 'vue'
import messages from './translations.json'

export const languages = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
] as const
type Locale = typeof languages[number]['value']
const supported = (value: string | null): value is Locale => languages.some(item => item.value === value)
function initialLanguage(): Locale {
  try {
    const saved = localStorage.getItem('region-snap-language')
    if (supported(saved)) return saved
  } catch { /* Storage can be unavailable in private or restricted browser contexts. */ }
  const language = navigator.language.split('-')[0]
  return supported(language) ? language : 'zh-CN'
}
export const locale = ref<Locale>(initialLanguage())
const table: Record<string, string[]> = messages
export function t(text: string): string {
  if (locale.value === 'zh-CN') return text
  const index = languages.findIndex(item => item.value === locale.value) - 1
  return table[text]?.[index] ?? table[text]?.[0] ?? text
}
watch(locale, value => {
  document.documentElement.lang = value
  document.title = value === 'zh-CN' ? 'region-snap · 框选所见，即刻成图' : 'region-snap · ' + t('框选所见，') + ' ' + t('即刻成图')
  try { localStorage.setItem('region-snap-language', value) } catch { /* Language selection still works without persistence. */ }
}, { immediate: true })
