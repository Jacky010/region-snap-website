# region-snap 官网

独立的 Vue + Vite 项目。演示直接使用 npm 发布的 `@region-snap/vue@0.1.1`，没有本地源码 alias、workspace 依赖或文件链接。

```powershell
npm install
npm run dev
```

打开 http://127.0.0.1:5175/ 。`npm run build` 执行 Vue 类型检查与生产构建，`npm run preview` 预览构建产物。

快速接入和文档通过站内视图切换展示，不打开其他页面。完整中文文档来自插件 README，保存在 `src/docs.zh-CN.md`；文档中的链接渲染为普通文字，只保留导航栏的 GitHub 外链。

支持简中、英、日、韩、法、德、西、葡八种界面语言；首次根据浏览器语言选择，手动切换后保存在本地。文档正文提供中文和英文，其他语言展示英文正文并标注。执行 npm run check 可检查发布包来源、导出及翻译完整性。
