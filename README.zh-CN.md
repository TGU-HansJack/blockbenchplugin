# Vintage Story Blockbench 插件

本插件让 Blockbench 导入、编辑和导出 Vintage Story 模型。插件界面已翻译为简体中文；模型 JSON 字段、服装槽位的存储值以及文件名仍保持原格式，以兼容现有资源。

## 安装

在 GitHub 的 **Actions > Build Plugin** 中打开一次成功的运行，下载 `vintagestory-plugin` 构建产物并解压。然后在 Blockbench 中打开 **文件 > 插件**，将其中的 `vintagestory.js` 拖入插件窗口。

## 本地打包

需要 Node.js 22。首次构建运行：

```console
npm ci
npm run gen_schema
npm run build
```

插件文件位于 `dist/vintagestory.js`。后续如果 `src/vs_shape_def.ts` 没有变化，只需运行 `npm run build`。开发构建可使用 `npm run dev`。

## 使用

在 Blockbench 中创建 **Vintage Story 基础格式**项目，或直接打开 VS 模型 JSON 文件。文件菜单中的导入/导出命令可处理 VS 模型及背景模型。设置中的 **游戏路径** 应指向包含 `assets`、`mods` 和 `lib` 的 Vintage Story 安装目录。

GitHub Actions 的 **Build Plugin** 工作流支持手动触发，并会在推送和拉取请求时打包。**Release** 工作流手动创建带 `vintagestory.js` 附件的草稿版本。
