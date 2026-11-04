import { createBlockbenchMod } from "../util/moddingTools";
import * as PACKAGE from "../../package.json";
import { get_game_path } from "../util/native";

declare var Setting: any;
declare var Settings: any;
declare var Dialog: any;
declare var Interface: any;

createBlockbenchMod(
    `${PACKAGE.name}:vs_gamepath_settings_mod`,
    {},
    _context => {
        const setting =  new Setting("game_path", {
            name: "游戏路径",
            description: "Vintage Story 游戏安装目录，即包含 assets、mods 和 lib 文件夹的目录。",
            category: "general",
            type: "click",
            icon: "fa-folder-plus",
            value: "",
            click() {
                new Dialog("gamePathSelect", {
                    title: "选择游戏路径",
                    form: {
                        path: {
                            label: "游戏文件夹路径",
                            type: "folder",
                            value: get_game_path(),
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
    () => {
    }

);

createBlockbenchMod(
    `${PACKAGE.name}:attachment_preset_settings_mod`,
    {},
    _context => {
        const presetSetting = new Setting("attachment_preset", {
            name: "附件预设",
            description: "选择服装或附件槽位系统：Glint 用于 Glint 角色自定义，Vintage Story 用于 Seraph 模型，也可选择自定义槽位。",
            category: "general",
            type: "select",
            value: "vintage_story",
            options: {
                glint: "Glint（外套、上衣、下装、靴子等）",
                vintage_story: "Vintage Story（手臂、头部、上身等）",
                custom: "自定义（自行配置槽位）"
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
    () => {
    }
);

createBlockbenchMod(
    `${PACKAGE.name}:attachment_custom_slots_settings_mod`,
    {},
    _context => {
        const customSlotsSetting = new Setting("attachment_custom_slots", {
            name: "自定义附件槽位",
            description: "使用自定义预设时，设置槽位名称（每行一个），例如 Head、Torso、Legs 等。请保持与模型中的槽位标识一致。",
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
    () => {
    }
);

createBlockbenchMod(
    `${PACKAGE.name}:vs_model_offset_settings_mod`,
    {},
    _context => {
        const setting = new Setting("vs_apply_model_offset", {
            name: "应用模型偏移",
            description: "为导出模型应用 [8, 0, 8] 偏移，使其在 Vintage Story 引擎中居中。如果模型位置已经正确，请关闭此选项。",
            category: "general",
            type: "toggle",
            value: true
        });
        return setting;
    },
    () => {
    }
);

createBlockbenchMod(
    `${PACKAGE.name}:vs_export_textures_settings_mod`,
    {},
    _context => {
        const setting = new Setting("vs_export_textures", {
            name: "导出纹理文件",
            description: "导出模型时自动将纹理文件保存到磁盘。关闭后仅在 JSON 中保留纹理引用，不保存实际纹理文件。",
            category: "general",
            type: "toggle",
            value: false
        });
        return setting;
    },
    () => {
    }
);


