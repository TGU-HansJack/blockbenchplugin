![Vintage Story 格式支持](header.png)

# Vintage Story 格式支持

这是一个 Blockbench（BB）插件，支持导入、编辑和导出 Vintage Story（VS）的 shape 模型，包括动画与附着点，可作为 Vintage Story Model Creator（VSMC）的替代工具。

本项目基于 [Anego Studios 的原项目](https://github.com/anegostudios/blockbenchplugin)进行简体中文汉化。**汉化作者：HansJack**，修改日期：2026-11-04。

## 安装

需要 **Blockbench 5.0.0 或更高版本的桌面版**。

下载 GitHub Actions 构建产物或 Release 中的压缩包并解压，保留其中的 `vintagestory.js`、`icon.png`、`about.md` 等文件。打开 Blockbench，选择 **文件 > 插件**，将 `vintagestory.js` 拖入插件窗口即可安装，也可通过插件窗口的“从文件加载插件”按钮选择此文件。

## 基本使用

- 通过 **文件 > 打开模型** 打开 VS shape JSON 文件。
- 通过 **文件 > 新建 > Vintage Story 基础格式** 创建模型。
- 使用 **导入** 和 **导出** 菜单中的 VS 操作交换模型文件。
- 在 **文件 > 首选项 > 设置 > 常规 > 游戏路径** 中选择 Vintage Story 安装目录（包含 `assets`、`mods` 和 `lib` 文件夹），以便自动查找原版纹理。
- 使用 **附件** 工具导入、管理和导出服装附件，在 **VS 面属性** 面板中调整自发光、反射和风动效果。
- 可在动画面板中导入、保存动画库；声音与粒子效果也支持预览。

服装槽位的界面名称已汉化；括号中的英文标识及文件格式字段保持原样，以兼容已有模型、自定义槽位和游戏资源。

## 本地构建

建议使用 Node.js 24 LTS，在项目目录运行：

```console
npm ci
npm run gen_schema
npm run build
```

插件使用 **esbuild** 构建，输出为 `dist/vintagestory.js`；`dist` 同时包含图标、插件说明、使用文档和许可证。仅在 `src/vs_shape_def.ts` 发生变化后需要重新生成 schema，后续构建通常只需运行 `npm run build`。

开发构建包含用于调试的 source map：

```console
npm run dev
```

运行 `npm run lint` 可检查代码。

## GitHub Actions

- **构建插件**：推送分支、提交拉取请求或手动触发后，安装锁定依赖、检查代码、生成 schema 并构建；可在工作流页面下载 `vintagestory` 产物。
- **创建发布草稿**：手动填写发布说明。工作流直接使用 `package.json` 中的版本生成插件、压缩包和发布标签，不自动递增版本，也不根据已有标签或发布记录修改版本。例如当前版本为 `0.12.3`，发布标签为 `v0.12.3`，压缩包为 `vintagestory-0.12.3.zip`。更新上游版本时，请同步维护 `package.json` 和 `package-lock.json` 中的版本。

## 原作者、版权与许可

插件由 **Darkluke1111** 创建，**codename-B** 参与贡献。经 Darkluke1111 许可，现由 Vintage Story 开发商 **Anego Studios** 维护。原作者署名、贡献者信息及版权声明均予以保留；HansJack 负责本分支的简体中文汉化。

- [上游源代码](https://github.com/anegostudios/blockbenchplugin)
- [上游问题跟踪](https://github.com/anegostudios/blockbenchplugin/issues)

本项目遵循 **GNU General Public License 第 3 版（GPL v3）**，详见 [LICENSE](LICENSE)。软件不提供任何担保；许可证英文原文予以保留。
