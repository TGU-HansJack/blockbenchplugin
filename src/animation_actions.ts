import { createAction } from "./util/moddingTools";
import * as PACKAGE from "../package.json";
import { is_vs_project } from "./util";
import { clear_animations } from "./import_animation";
import { relink_particle_previews } from "./animation_particles";

// Importing and exporting VS animation files is handled natively by the multi-file
// animation workflow (format `animation_files` + the VS AnimationCodec): use the
// ANIMATIONS panel's Import Animations / Save / Save All. Only the bulk-clear helper
// remains as a convenience action here.

const clear_animations_action = createAction(`${PACKAGE.name}:clear_animations_vs`, {
    name: '清空所有动画',
    icon: 'delete_sweep',
    condition() {
        return is_vs_project(Project);
    },
    click: function () {
        const total = Blockbench.Animation.all.length;
        if (total === 0) {
            Blockbench.showQuickMessage('没有可清空的动画');
            return;
        }
        if (!confirm(`确定删除此项目中的全部 ${total} 个动画吗？\n\n可使用 Ctrl+Z 撤销。`)) {
            return;
        }
        const removed = clear_animations();
        Blockbench.showQuickMessage(`已清空 ${removed} 个动画`);
    }
});
MenuBar.addAction(clear_animations_action, 'edit');

// Particle keyframes only preview once their effect code has been resolved to a Snowstorm
// emitter file. Import does that automatically; this re-runs it for hand-authored keyframes
// and for effects added to the assets folder since the model was opened.
const reload_vfx_action = createAction(`${PACKAGE.name}:reload_vfx_previews`, {
    name: '重新加载特效预览',
    icon: 'auto_awesome',
    condition() {
        return is_vs_project(Project);
    },
    click: function () {
        const linked = relink_particle_previews();
        Blockbench.showQuickMessage(
            linked === 0
                ? '未能找到可用的粒子效果'
                : `已关联 ${linked} 个粒子关键帧`
        );
    }
});
MenuBar.addAction(reload_vfx_action, 'animation');
