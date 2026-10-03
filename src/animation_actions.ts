import { createAction } from "./util/moddingTools";
import * as PACKAGE from "../package.json";
import { is_vs_project } from "./util";
import { clear_animations } from "./import_animation";

// Importing and exporting VS animation files is handled natively by the multi-file
// animation workflow (format `animation_files` + the VS AnimationCodec): use the
// ANIMATIONS panel's Import Animations / Save / Save All. Only the bulk-clear helper
// remains as a convenience action here.

const clear_animations_action = createAction(`${PACKAGE.name}:clear_animations_vs`, {
    name: '清除所有动画',
    icon: 'delete_sweep',
    condition() {
        return is_vs_project(Project);
    },
    click: function () {
        const total = (Animation as unknown as typeof _Animation).all.length;
        if (total === 0) {
            Blockbench.showQuickMessage('没有可清除的动画');
            return;
        }
        if (!confirm(`确定删除此项目中的全部 ${total} 个动画吗？\n\n可使用 Ctrl+Z 撤销。`)) {
            return;
        }
        const removed = clear_animations();
        Blockbench.showQuickMessage(`已清除 ${removed} 个动画`);
    }
});
MenuBar.addAction(clear_animations_action, 'edit');
