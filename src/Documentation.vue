<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked, Renderer } from 'marked'
import chinese from './docs.zh-CN.md?raw'
import english from './docs.en.md?raw'
import { locale, t } from './language'

const props = defineProps<{ initialTopic: string }>()
defineEmits<{ start: [] }>()
const topics = ['安装', 'Vue 3', 'React', '原生 JS', 'API', '自定义渲染器', '跨域 iframe', '自定义样式', '注意事项']
function chapters(markdown: string) {
  return markdown.split(/^## /m).slice(1, topics.length + 1).map((text, index) => ({ title: topics[index], content: '## ' + text }))
}
const chineseSections = chapters(chinese)
const englishSections = chapters(english)
const sections = computed(() => locale.value === 'zh-CN' ? chineseSections : englishSections)
const active = ref(topics.includes(props.initialTopic) ? props.initialTopic : '安装')
const search = ref('')
const visibleSections = computed(() => sections.value.filter(section => `${section.title} ${t(section.title)} ${section.content}`.toLowerCase().includes(search.value.toLowerCase())))
const renderer = new Renderer()
// Bundled project documentation is trusted content; links are displayed as text to keep reading on-site.
renderer.link = ({ tokens }) => renderer.parser.parseInline(tokens)
renderer.image = () => ''
const content = computed(() => marked.parse(sections.value.find(section => section.title === active.value)?.content ?? '', { renderer, async: false }))
const activeIndex = computed(() => topics.indexOf(active.value))
function select(title: string) {
  active.value = title
  window.scrollTo({ top: 0, behavior: 'instant' })
}
</script>

<template>
  <main class="docs-page">
    <aside class="docs-sidebar">
      <span class="overline">REGION-SNAP / DOCS</span>
      <h2>{{ t('文档') }}</h2>
      <label class="docs-search"><span>⌕</span><input v-model="search" :aria-label="t('搜索文档')" :placeholder="t('搜索标题或内容…')"></label>
      <nav :aria-label="t('文档目录')"><button v-for="section in visibleSections" :key="section.title" :class="{ active: active === section.title }" @click="select(section.title)">{{ t(section.title) }}<span>→</span></button><p v-if="!visibleSections.length">{{ t('没有找到相关内容') }}</p></nav>
      <div class="docs-sidebar-bottom"><span>{{ t('基于 v0.1.1 中文文档') }}</span><button @click="$emit('start')">{{ t('返回快速接入 →') }}</button></div>
    </aside>
    <article class="docs-content"><div class="docs-breadcrumb">{{ t('文档') }} <span>/</span> {{ t(active) }}</div><p v-if="locale !== 'zh-CN' && locale !== 'en'" class="docs-language-note">{{ t('当前章节正文提供英文版本。') }}</p><div class="markdown-content" :lang="locale === 'zh-CN' ? 'zh-CN' : 'en'" v-html="content"></div><div class="docs-pagination"><button v-if="activeIndex > 0" @click="select(topics[activeIndex - 1])">{{ t('← 上一节') }}</button><button v-if="activeIndex < topics.length - 1" @click="select(topics[activeIndex + 1])">{{ t('下一节 →') }}</button></div></article>
  </main>
</template>
