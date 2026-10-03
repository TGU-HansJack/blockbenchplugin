import { createBlockbenchMod } from "../util/moddingTools";
import * as PACKAGE from "../../package.json";
import * as process from "process";

declare var Setting: any;
declare var Settings: any;
declare var Dialog: any;
declare var Interface: any;

/*
 * Making a custom settinsg category errors out when loading the plugin upon the start of Blockbench 
 * (works fine when the plugin is loaded after Blockbench has alrady started).
 * Probably an issue where Blockbench loads the plugin when the Settings dialog isn't fully initialized yet... =/
 */
// 
// createBlockbenchMod(
//     `${PACKAGE.name}:vs_settings_category_mod`,
//     {},
//     _context => {
//         //@ts-expect-error: addCategory is not available in blockbench types yet
//         Settings.addCategory("vintage_story", {name: "Vintage Story"});
//     },
//     _context => {
//         removeSettingsCategory("vintage_story");
//     }

// );

function removeSettingsCategory(id: string) {
    if(Settings.dialog[id]){
        delete Settings.structure[id];
        delete Settings.dialog.sidebar.pages[id];
        Settings.dialog.sidebar.build();
    }
}


createBlockbenchMod(
    `${PACKAGE.name}:vs_gamepath_settings_mod`,
    {},
    _context => {
        const setting =  new Setting("game_path", {
            name: "游戏路径",
            description: "Vintage Story 游戏目录，包含 assets、mods 和 lib 文件夹。",
            category: "general",
            type: "click",
            icon: "fa-folder-plus",
            value: Settings.get("asset_path") || process.env.VINTAGE_STORY || "",
            click() {
                new Dialog("gamePathSelect", {
                    title: "选择游戏路径",
                    form: {
                        path: {
                            label: "游戏目录路径",
                            type: "folder",
                            value: Settings.get("game_path") || process.env.VINTAGE_STORY || "",
                        }
                    },
                    onConfirm(formResult) {
                        setting.set(formResult.path);
                        console.log("setting and saving");
                        Settings.save();
                    }
                }).show();
            }
        });
        return setting;
    },
    context => {
        //context?.delete();
    }

);

createBlockbenchMod(
    `${PACKAGE.name}:attachment_preset_settings_mod`,
    {},
    _context => {
        const presetSetting = new Setting("attachment_preset", {
            name: "附件槽位预设",
            description: "选择服装和附件槽位体系：Glint 用于角色自定义，Vintage Story 用于炽天使模型，也可以自定义槽位。",
            category: "general",
            type: "select",
            value: "glint",
            options: {
                glint: "Glint（外套、上衣、下装、鞋靴等）",
                vintage_story: "Vintage Story（手臂、头部、上半身等）",
                custom: "自定义（配置自己的槽位）"
            },
            onChange() {
                // Refresh attachments panel when preset changes
                try {
                    if (Interface.Panels.attachments_panel && Interface.Panels.attachments_panel.vue) {
                        Interface.Panels.attachments_panel.vue.updateAttachments();
                    }
                } catch (e) {
                    console.warn('Could not refresh attachments panel:', e);
                }
            }
        });

        return presetSetting;
    },
    context => {
        //context?.delete();
    }
);

createBlockbenchMod(
    `${PACKAGE.name}:attachment_custom_slots_settings_mod`,
    {},
    _context => {
        const customSlotsSetting = new Setting("attachment_custom_slots", {
            name: "自定义附件槽位",
            description: "使用自定义预设时设置槽位名称，每行一个，例如 Head、Torso、Legs。",
            category: "general",
            type: "click",
            icon: "fa-list",
            value: "",
            condition: () => Settings.get("attachment_preset") === "custom",
            click() {
                new Dialog("customSlotsEdit", {
                    title: "编辑自定义附件槽位",
                    form: {
                        slots: {
                            label: "槽位名称（每行一个）",
                            type: "textarea",
                            value: (Settings.get("attachment_custom_slots") || []).join("\n"),
                        }
                    },
                    onConfirm(formResult) {
                        // Split by newlines and filter out empty lines
                        const slots = formResult.slots
                            .split("\n")
                            .map((s: string) => s.trim())
                            .filter((s: string) => s.length > 0);

                        customSlotsSetting.set(slots);
                        Settings.save();

                        // Refresh attachments panel
                        try {
                            if (Interface.Panels.attachments_panel && Interface.Panels.attachments_panel.vue) {
                                Interface.Panels.attachments_panel.vue.updateAttachments();
                            }
                        } catch (e) {
                            console.warn('Could not refresh attachments panel:', e);
                        }
                    }
                }).show();
            }
        });

        return customSlotsSetting;
    },
    context => {
        //context?.delete();
    }
);

createBlockbenchMod(
    `${PACKAGE.name}:vs_model_offset_settings_mod`,
    {},
    _context => {
        const setting = new Setting("vs_apply_model_offset", {
            name: "应用模型偏移",
            description: "导出时应用 [8, 0, 8] 偏移，使模型在 Vintage Story 中居中。如果模型位置已正确，请关闭此项。",
            category: "general",
            type: "checkbox",
            value: true
        });
        return setting;
    },
    context => {
        //context?.delete();
    }
);

createBlockbenchMod(
    `${PACKAGE.name}:vs_export_textures_settings_mod`,
    {},
    _context => {
        const setting = new Setting("vs_export_textures", {
            name: "导出纹理文件",
            description: "导出模型时自动保存纹理文件。关闭后仅在 JSON 中保留纹理引用，不保存纹理文件。",
            category: "general",
            type: "checkbox",
            value: false
        });
        return setting;
    },
    context => {
        //context?.delete();
    }
);

