<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RegionSnap, type Region, type RegionSnapExpose } from '@region-snap/vue'
import Documentation from './Documentation.vue'
import { languages, locale, t } from './language'

const snap = ref<RegionSnapExpose | null>(null)
const region = ref<Region | null>(null)
const preview = ref('')
const error = ref('')
const dimensions = ref('')
const copied = ref('')
const framework = ref('Vue')
const scene = ref('数据报表')
const page = ref<'home' | 'start' | 'docs'>('home')
const docTopic = ref('安装')
function navigate(value: 'home' | 'start' | 'docs', topic = '安装') {
  page.value = value
  docTopic.value = topic
  window.scrollTo({ top: 0, behavior: 'instant' })
  if (value === 'home') void preset()
}
function homeSection(id: string) {
  page.value = 'home'
  void nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
}
const packageName = computed(() => ({ Vue: 'vue', React: 'react', JavaScript: 'core' })[framework.value])
const command = computed(() => `npm i @region-snap/${packageName.value}`)
const code = computed(() => framework.value === 'Vue'
  ? `<script setup>\nimport { RegionSnap } from '@region-snap/vue'\n<\/script>\n\n<template>\n  <RegionSnap mask show-size @capture="onCapture">\n    <YourContent />\n  </RegionSnap>\n</template>`
  : framework.value === 'React'
    ? `import { RegionSnap } from '@region-snap/react'\n\nexport function App() {\n  return (\n    <RegionSnap mask showSize onCapture={onCapture}>\n      <YourContent />\n    </RegionSnap>\n  )\n}`
    : `import { RegionSnap } from '@region-snap/core'\n\nconst snap = new RegionSnap(\n  document.querySelector('#container'),\n  document.querySelector('#content'),\n  { mask: true, showSize: true, onCapture },\n)\n\nconst file = await snap.getFile()`)

async function copy(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => { copied.value = '' }, 1800)
  } catch { error.value = t('暂时无法访问剪贴板，请手动选择并复制代码。') }
}
function captured(src: string) {
  error.value = ''
  preview.value = src
  const img = new Image()
  img.onload = () => { dimensions.value = `${img.naturalWidth} × ${img.naturalHeight} px` }
  img.src = src
}
async function download() {
  try {
    const src = await snap.value?.getImage()
    if (!src) return
    const link = document.createElement('a')
    link.href = src
    link.download = 'region-snap.png'
    link.click()
  } catch { error.value = t('截图生成失败，请重新框选后再试。') }
}
async function preset() {
  await nextTick()
  const target = document.querySelector<HTMLElement>('.report-chart')
  const paper = document.querySelector<HTMLElement>('.region-snap__content')
  if (target && paper) {
    const a = target.getBoundingClientRect()
    const b = paper.getBoundingClientRect()
    snap.value?.setRegion({ x: a.left - b.left, y: a.top - b.top, width: a.width, height: a.height })
  }
}
async function changeScene(value: string) {
  scene.value = value
  snap.value?.clear()
  preview.value = ''
  await preset()
}
watch(locale, () => { if (page.value === 'home') { snap.value?.clear(); void preset() } })
onMounted(preset)
</script>

<template>
  <header class="nav">
    <a class="brand" href="#" @click.prevent="navigate('home')"><span class="brand-mark">+</span>region<span class="brand-dash">-</span>snap<span class="brand-dot">.</span></a>
    <nav :aria-label="t('主导航')"><button :class="{ selected: page === 'home' }" @click="homeSection('play')">{{ t("在线体验") }}</button><button @click="homeSection('features')">{{ t("功能") }}</button><button :class="{ selected: page === 'start' }" @click="navigate('start')">{{ t("快速接入") }}</button><button :class="{ selected: page === 'docs' }" @click="navigate('docs')">{{ t("文档") }}</button></nav>
    <div class="nav-actions"><label class="language-picker"><span aria-hidden="true">◎</span><select v-model="locale" :aria-label="t('语言')"><option v-for="language in languages" :key="language.value" :value="language.value">{{ language.label }}</option></select></label><a class="github" href="https://github.com/Jacky010/region-snap" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.82c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.62 1.22 3.26.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.31 3.08 1.15A10.8 10.8 0 0 1 12 6.12c.95 0 1.89.13 2.78.37 2.13-1.46 3.07-1.15 3.07-1.15.62 1.55.23 2.69.12 2.98.72.79 1.15 1.79 1.15 3.02 0 4.33-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>GitHub <span>↗</span></a></div>
  </header>

  <main v-if="page === 'home'">
    <section class="hero">
      <div class="eyebrow"><span></span> {{ t("为开发者打造的区域截图组件") }} <b>OPEN SOURCE</b></div>
      <h1>{{ t("框选所见，") }}<span class="headline-selection">{{ t("即刻成图") }}<i></i><i></i><i></i><i></i></span></h1>
      <p class="hero-description">{{ t("让截图，成为应用里的自然交互。") }}<br>{{ t("从一段文字到一张图表，拖动框选，清晰捕获。") }}</p>
      <div class="hero-actions"><a class="button primary" href="#play" @click="preset">{{ t("动手框选试试") }} <span>↗</span></a><button class="button secondary" @click="navigate('start')">{{ t("几行代码，开始接入") }} <span>→</span></button></div>
      <div class="frameworks"><span>{{ t("适配你的技术栈") }}</span><b class="vue-icon">▼</b> Vue 3 <b class="react-icon">⚛</b> React <b class="js-icon">JS</b> JavaScript <span class="type-tag">{{ t("TS 类型支持") }}</span></div>
      <div class="hero-note">DRAG. CAPTURE. BUILD.</div>
    </section>

    <section id="play" class="play-section">
      <div class="section-kicker"><span><i class="live-dot"></i> LIVE PLAYGROUND</span><span>{{ t("真正的组件，真实的截图") }} <span class="curve-arrow">↙</span></span></div>
      <div class="workbench">
        <div class="workbench-top"><div class="window-dots"><i></i><i></i><i></i></div><span>{{ t("你的下一次截图，从这里开始") }}</span><span class="local-badge"><i></i> {{ t("浏览器本地生成") }}</span></div>
        <div class="workspace">
          <div class="editor">
            <div class="scene-tabs" :aria-label="t('在线体验')"><button v-for="item in ['数据报表', '文章摘录']" :key="item" :class="{ active: scene === item }" @click="changeScene(item)">{{ item === '数据报表' ? '▥' : '≡' }} &nbsp;{{ t(item) }}</button><button class="scene-doc-button" @click="navigate('docs', '跨域 iframe')">{{ t("iframe / 长截图说明") }}</button></div>
            <RegionSnap ref="snap" v-model:region="region" class="capture-stage" show-size :clear-on-click-outside="false" @clear="preview = ''; dimensions = ''" @capture="captured" @error="error = t('截图生成失败，请重新框选后再试。')">
              <div class="paper">
                <div class="paper-meta"><span>ACME STUDIO / INSIGHTS</span><span>NOV 2026</span></div>
                <template v-if="scene === '数据报表'">
                  <h2>{{ t("每一次增长，都值得记录。") }}</h2><p class="paper-desc">{{ t("2026 年度产品洞察 · 第四季度概览") }}</p>
                  <div class="metrics"><div><span>{{ t("总访问量") }}</span><strong>128,540<small>↗ 24.8%</small></strong></div><div><span>{{ t("活跃用户") }}</span><strong>32,816<small>↗ 18.6%</small></strong></div><div><span>{{ t("转化率") }}</span><strong>8.42<em>%</em><small>↗ 3.2%</small></strong></div></div>
                  <div class="report-chart"><div class="chart-heading"><strong>{{ t("用户增长趋势") }}</strong><span><i></i> {{ t("本年度") }} <i></i> {{ t("上年度") }}</span></div><div class="plot"><div class="axis"><span>40k</span><span>30k</span><span>20k</span><span>10k</span></div><div class="bars"><div v-for="(height, i) in [28, 40, 35, 51, 46, 64, 58, 72, 67, 83, 78, 96]" :key="i" class="bar-group"><div class="bar previous" :style="{ height: `${height * .66}%` }"></div><div class="bar current" :style="{ height: `${height}%` }"></div><span>{{ new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2026, i, 1)) }}</span></div></div></div><div class="chart-foot">{{ t("稳步积累，持续向前。") }}<span>{{ t("较去年同期增长 24.8% ↗") }}</span></div></div>
                  <p class="paper-bottom">{{ t("好的工具，让你专注于真正重要的内容。") }}</p>
                </template>
                <template v-else>
                  <h2>{{ t("把灵感留在发生的瞬间。") }}</h2><p class="paper-desc">{{ t("设计随笔 · 关于观察与创造") }}</p>
                  <div class="report-chart article"><span class="article-label">FIELD NOTES / 001</span><h3>{{ t("从看见，到留下。") }}</h3><p>{{ t("有时候，让我们停下来的，是一段恰到好处的文字，是一张解释清楚问题的图表，也是一个值得反复琢磨的细节。") }}</p><blockquote>{{ t("让工具退后一步，让内容向前一步。") }}</blockquote><p>{{ t("选中你想留下的部分。保留上下文，也保留最初的清晰。") }}</p></div>
                  <p class="paper-bottom">{{ t("试着框选这段文字，保存此刻的灵感。") }}</p>
                </template>
              </div>
              <template #toolbar="{ clear, capturing }"><div class="selection-toolbar"><span>✧</span><button :disabled="capturing" @click="download">{{ capturing ? t('生成中…') : t('下载截图 ↓') }}</button><span class="toolbar-separator"></span><button :aria-label="t('清除选区')" @click="clear">×</button></div></template>
            </RegionSnap>
            <div class="editor-footer"><span>{{ t("⌖ 拖动框选 · 拖拽角点调整") }}</span><span><kbd>esc</kbd> {{ t("取消选区") }}</span></div>
          </div>
          <aside class="result"><div class="result-title"><h3>{{ t("截图预览") }}</h3><span :class="{ ready: preview }">{{ preview ? t('已生成') : t('等待框选') }}</span></div><div class="preview-area"><img v-if="preview" :src="preview" :alt="t('当前选区生成的真实截图')"><div v-else class="empty"><span>⌗</span>{{ t("在左侧框选，截图将在这里出现") }}</div></div><div class="result-meta"><span>PNG</span><span>{{ preview ? dimensions : '— × — px' }}</span></div><button class="download-button" :disabled="!region" @click="download">{{ t("下载截图") }} <span>↓</span></button><p class="result-note">{{ t("从选区到图片，只需一次拖动。") }}<br>{{ t("试着移动选区，看看有什么变化。") }}</p><div class="result-bottom"><span>{{ t("✓ 无需上传文件") }}</span><span>{{ t("✓ 即选即用") }}</span></div></aside>
        </div>
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="play-caption"><span><b>01</b> {{ t("框选内容") }}</span><i>→</i><span><b>02</b> {{ t("调整选区") }}</span><i>→</i><span><b>03</b> {{ t("获取图片") }}</span><button @click="navigate('docs', 'API')">{{ t("查看组件 API") }}</button></div>
    </section>

    <section id="features" class="features-section"><div class="section-title"><div><span class="overline">SMALL COMPONENT. REAL POSSIBILITIES.</span><h2>{{ t("轻巧接入，从容应对真实页面。") }}</h2></div><p>{{ t("交互细节交给组件，") }}<br>{{ t("你的精力留给产品。") }}</p></div><div class="features"><article><div class="feature-graphic crop-graphic"><span></span><i></i><b>240 × 160</b></div><span class="feature-number">01 / INTERACTION</span><h3>{{ t("选得准，也改得动。") }}</h3><p>{{ t("拖动框选、移动、八向调整大小。支持边缘自动滚动，触屏长按也能自然操作。") }}</p></article><article><div class="feature-graphic pixel-graphic"><div></div><span>1 : 1</span><b>{{ t("原图分辨率裁剪") }}</b></div><span class="feature-number">02 / CLARITY</span><h3>{{ t("留下细节，保持清晰。") }}</h3><p>{{ t("图片与 Canvas 可直接从源图裁剪，普通内容适配屏幕像素密度，让每个细节清楚呈现。") }}</p></article><article><div class="feature-graphic output-graphic"><span>{{ t("选区") }}</span><i>→</i><div><b>PNG</b><b>Blob</b><b>File</b></div></div><span class="feature-number">03 / FLEXIBILITY</span><h3>{{ t("截下来，然后自由发挥。") }}</h3><p>{{ t("导出图片、上传文件，或接入你的 OCR 服务。自定义工具栏，让截图融入业务流程。") }}</p></article></div></section>

    <section id="integrate" class="integration"><div class="integration-copy"><span class="overline">BUILT FOR YOUR STACK</span><h2>{{ t("你的内容，") }}<br>{{ t("加上一层截图能力。") }}</h2><p>{{ t("保留已有界面，包裹需要框选的内容。") }}<br>{{ t("Vue、React 或原生 JavaScript，由你选择。") }}</p><div class="install"><code>{{ command }}</code><button :aria-label="t('复制安装命令')" @click="copy(command, 'install')">{{ copied === 'install' ? t('已复制 ✓') : t('复制 ⧉') }}</button></div><button class="text-button" @click="navigate('start')">{{ t("查看完整接入步骤") }} <span>→</span></button></div><div class="code-panel"><div class="code-tabs"><div><button v-for="item in ['Vue', 'React', 'JavaScript']" :key="item" :class="{ active: framework === item }" @click="framework = item">{{ t(item) }}</button></div><button class="copy-code" @click="copy(code, 'code')">{{ copied === 'code' ? t('已复制 ✓') : t('复制代码 ⧉') }}</button></div><pre><code>{{ code }}</code></pre><div class="code-footer"><span>●</span> {{ t("展示核心接入方式，回调与内容组件由业务实现") }}</div></div></section>

    <section class="closing"><span class="brand-mark">+</span><h2>{{ t("把值得留下的，框起来。") }}</h2><a class="button primary" href="#play">{{ t("试试 region-snap") }} <span>↗</span></a></section>
  </main>
  <main v-else-if="page === 'start'" class="start-page">
    <div class="page-intro"><span class="overline">QUICK START</span><h1>{{ t("让截图，融入你的应用。") }}</h1><p>{{ t("选择你的技术栈，安装组件，包裹内容。所有步骤都在这里。") }}</p><span class="published-badge">{{ t("npm 已发布 · v0.1.1") }}</span></div>
    <div class="start-layout"><aside class="start-summary"><h3>{{ t("从安装到第一次截图") }}</h3><ol><li>{{ t("选择框架与安装") }}</li><li>{{ t("添加截图组件") }}</li><li>{{ t("处理截图结果") }}</li></ol><p>{{ t("无需单独引入 CSS，组件自动注入样式。") }}<br>{{ t("支持自定义工具栏和多种图片输出格式。") }}<br>{{ t("先完成基础接入，再按需配置。") }}</p><button class="text-button" @click="navigate('docs', 'API')">{{ t("继续阅读 API 文档 →") }}</button></aside><div class="start-content">
    <section><span class="step-label">01 / INSTALL</span><h2>{{ t("选择你的技术栈") }}</h2><div class="start-frameworks"><button v-for="item in ['Vue', 'React', 'JavaScript']" :key="item" :class="{ active: framework === item }" @click="framework = item">{{ t(item) }}</button></div><div class="install"><code>{{ command }}</code><button @click="copy(command, 'install')">{{ copied === 'install' ? t('已复制 ✓') : t('复制 ⧉') }}</button></div><p class="start-note">{{ t("Vue 需要 3.3+；React 需要 17+。原生 JavaScript 使用 core 包。") }}</p></section>
    <section><span class="step-label">02 / INTEGRATE</span><h2>{{ t("把内容交给 RegionSnap") }}</h2><p>{{ t("下方是核心结构示例。将 YourContent 替换为你的内容，并实现 onCapture 回调；完整用法可直接在本站文档中查看。") }}</p><div class="code-panel"><div class="code-tabs"><span>{{ framework }} · {{ t('组件接入') }}</span><button @click="copy(code, 'code')">{{ copied === 'code' ? t('已复制 ✓') : t('复制代码 ⧉') }}</button></div><pre><code>{{ code }}</code></pre></div><button class="text-button" @click="navigate('docs', framework === 'Vue' ? 'Vue 3' : framework === 'React' ? 'React' : '原生 JS')">{{ t('查看') }} {{ framework }} {{ t('完整用法') }} →</button></section>
    <section><span class="step-label">03 / CAPTURE</span><h2>{{ t("拿到截图，接入你的业务") }}</h2><p>{{ t("onCapture 收到 Data URL，可以用作图片预览。通过实例或工具栏参数调用 getBlob()、getFile()，即可拿到可上传的数据。") }}</p><div class="output-options"><div><strong>Data URL</strong><span>{{ t("用于图片预览") }}</span></div><div><strong>Blob</strong><span>{{ t("追加至 FormData") }}</span></div><div><strong>File</strong><span>{{ t("交给文件上传接口") }}</span></div></div><button class="button primary" @click="homeSection('play')">{{ t("回到在线体验 ↗") }}</button></section>
    </div></div>
  </main>
  <Documentation v-else :initial-topic="docTopic" @start="navigate('start')" />
  <footer><a class="brand" href="#" @click.prevent="navigate('home')">region-snap<span class="brand-dot">.</span></a><span>Made for the details that matter.</span><div><button @click="navigate('docs')">{{ t("文档") }}</button><button @click="navigate('start')">{{ t("快速接入") }}</button><span class="prototype-label">npm v0.1.1</span></div></footer>
</template>
