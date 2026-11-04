import { createAction } from "./util/moddingTools";
import * as PACKAGE from "../package.json";
import icon from "../icon.png";
import { is_vs_project } from "./util";
import { im } from "./import";
import { is_backdrop_project } from "./util/misc";
import { ex } from "./export";
import { fs } from "./util/native";

const path = requireNativeModule('path');

const export_action = createAction(`${PACKAGE.name}:export_vs`, {
    name: '导出为 VS 格式',
    icon: icon,
    condition() {
        return is_vs_project(Project);
    },
    click: function () {
        if (!Project) {
            throw new Error("导出时未加载项目");
        }

        // Use Blockbench's file save dialog with custom_writer to avoid
        // writing empty content before the actual data is ready
        Blockbench.export({
            name: Project.name,
            type: 'json',
            extensions: ['json'],
            savetype: 'text',
            custom_writer: (_content, exportPath) => {
                try {
                    const exportDir = path.dirname(exportPath);
                    const data = ex({ path: exportPath, exportDir: exportDir });
                    const jsonContent = autoStringify(data);
                    fs.writeFileSync(exportPath, jsonContent);
                    Blockbench.showQuickMessage('模型和纹理导出成功');
                } catch (e) {
                    console.error('[VS Export] 导出失败：', e);
                    Blockbench.showMessageBox({
                        title: 'VS 导出错误',
                        message: `导出失败： ${e instanceof Error ? e.message : String(e)}`
                    });
                }
            }
        });
    }
});
MenuBar.addAction(export_action, 'file.export');

const import_action = createAction(`${PACKAGE.name}:import_vs`, {
    name: '从 VS 格式导入',
    icon: icon,
    condition() {
        return is_vs_project(Project);
    },
    click: function () {
        Blockbench.import({
            type: 'json',
            extensions: ['json'],
        }, function (files) {
            // codec and parse should be valid if action condition is met
            im(autoParseJSON(files[0].content as string), files[0].path, false);
        });
    }
});
MenuBar.addAction(import_action, 'file.import');

const import_backdrop_action = createAction(`${PACKAGE.name}:import_backdrop_action`, {
    name: '从 VS 格式导入背景模型',
    icon: icon,
    condition() {
        return is_vs_project(Project);
    },
    click: function () {
        Blockbench.import({
            type: 'json',
            extensions: ['json'],
        }, function (files) {
            if (is_backdrop_project()) {
                Blockbench.showQuickMessage("此项目中已有背景模型。");
            } else {
                im(autoParseJSON(files[0].content as string), files[0].path, true);
            }
        });
    }
});
MenuBar.addAction(import_backdrop_action, 'file.import');
