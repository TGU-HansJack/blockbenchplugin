import { VS_Direction, VS_EditorSettings, VS_Face, VS_ReflectiveMode } from "./vs_shape_def";

export const VS_PROJECT_PROPS = [
    new Property(ModelProject, "string", "backDropShape", { exposed: false, }),
    new Property(ModelProject, "string", "collapsedPaths", { exposed: false, }),
    new Property(ModelProject, "boolean", "allAngles", { exposed: false, }),
    new Property(ModelProject, "boolean", "entityTextureMode", { exposed: false, }),
    new Property(ModelProject, "boolean", "singleTexture", { exposed: false, }),
    new Property(ModelProject, "boolean", "vsFormatConverted", { exposed: false, }),
];

type InternalPropertyType = 'vector' | 'vector2' | 'object' | 'boolean';

function isFiniteVector(value: unknown, length: 2 | 3): boolean {
    return Array.isArray(value)
        && value.length === length
        && value.every(component => typeof component === 'number' && Number.isFinite(component));
}

function isNonEmptyRecord(value: unknown): boolean {
    return value !== null
        && typeof value === 'object'
        && !Array.isArray(value)
        && Object.keys(value).length > 0;
}

function registerOptionalInternalProperty(
    targetClass: any,
    type: InternalPropertyType,
    name: string,
    validate: (value: unknown, container?: any) => boolean,
) {
    return new Property(targetClass, type, name, {
        exposed: false,
        condition(instance: any) {
            return validate(instance?.[name], instance);
        },
        reset(instance: any) {
            delete instance[name];
        },
        merge(instance: any, data: any) {
            const value = data?.[name];
            if (!validate(value, data)) return;
            if (Array.isArray(value)) {
                instance[name] = value.slice();
            } else if (value !== null && typeof value === 'object') {
                instance[name] = structuredClone(value);
            } else {
                instance[name] = value;
            }
        },
    });
}

function registerStepParentTransformProperties(targetClass: any) {
    registerOptionalInternalProperty(
        targetClass,
        'boolean',
        'vs_step_parent_local',
        value => value === true
    );
    registerOptionalInternalProperty(
        targetClass,
        'boolean',
        'vs_has_step_parent_transform',
        value => value === true
    );

    for (const name of ['vs_step_parent_origin', 'vs_step_parent_rotation']) {
        registerOptionalInternalProperty(
            targetClass,
            'vector',
            name,
            (value, container) => container?.vs_has_step_parent_transform === true && isFiniteVector(value, 3)
        );
    }
}

const PALETTE_SLOT_OPTIONS = {
    '0': '0 - 继承 / 默认',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
};

function registerPaletteSlotProperty(targetClass: any) {
    const property = new Property(targetClass, 'number', 'paletteSlot', {
        default: 0,
        label: '调色板槽位',
        exposed: true,
        options: PALETTE_SLOT_OPTIONS,
        inputs: {
            element_panel: {
                input: {
                    label: '调色板槽位',
                    type: 'select',
                    options: PALETTE_SLOT_OPTIONS,
                },
            },
        },
    });

    return property;
}

export const VS_GROUP_PROPS = [
    new Property(Group, "string", "stepParentName", {
        default: '',
        label: "步骤父级",
        exposed: true,
        inputs: {
            element_panel: {
                input: {
                    label: '步骤父级',
                    type: 'text'
                }
            }
        },
        onChange() {
            Canvas.updateAllBones();
            Canvas.updateAllPositions();
        },
    }),
    registerPaletteSlotProperty(Group),
];

// Blockbench-only properties (not exported to VS JSON format)
new Property(Group, "string", "clothingSlot", {
    default: '',
    label: "服装槽位",
    exposed: true,
    options: () => {
        const { getActiveSlotNames, getSlotDisplayName } = require('./attachments/presets');
        const slots = getActiveSlotNames();
        const options: {[key: string]: string} = { '': '无' };
        slots.forEach((slot: string) => {
            options[slot] = getSlotDisplayName(slot, true);
        });
        return options;
    },
    inputs: {
        element_panel: {
            input: {
                label: '服装槽位',
                type: 'select',
                options: () => {
                    const { getActiveSlotNames, getSlotDisplayName } = require('./attachments/presets');
                    const slots = getActiveSlotNames();
                    const options: {[key: string]: string} = { '': '无' };
                    slots.forEach((slot: string) => {
                        options[slot] = getSlotDisplayName(slot, true);
                    });
                    return options;
                }
            }
        }
    },
    onChange() {
        try {
            if ((Interface as any).Panels?.attachments_panel?.vue) {
                (Interface as any).Panels.attachments_panel.vue.updateAttachments();
            }
        } catch (e) {
            console.warn('Could not refresh attachments panel:', e);
        }
    },
});

new Property(Group, "boolean", "backdrop");

// Blockbench-only attachment round-trip metadata. The boolean flags gate the
// vector values so their default [0, 0, 0] cannot be mistaken for authored data.
registerStepParentTransformProperties(Group);

// Internal VS round-trip values. These stay out of VS_GROUP_PROPS so they are
// saved in .bbmodel projects without being emitted as Vintage Story JSON keys.
registerOptionalInternalProperty(Group, 'vector', 'vs_group_from', value => isFiniteVector(value, 3));
registerOptionalInternalProperty(Group, 'vector', 'vs_group_to', value => isFiniteVector(value, 3));
registerOptionalInternalProperty(Group, 'boolean', 'vs_has_rotation_origin', value => value === true);
registerOptionalInternalProperty(Group, 'object', 'vs_zero_size_faces', isNonEmptyRecord);
registerOptionalInternalProperty(Group, 'vector2', 'vs_uv', value => isFiniteVector(value, 2));

export const VS_CUBE_PROPS = [
    new Property(Cube, "string", "stepParentName", {
        default: '',
        label: "步骤父级",
        exposed: true,
        inputs: {
            element_panel: {
                input: {
                    label: '步骤父级',
                    type: 'text'
                }
            }
        },
        onChange() {
            Canvas.updateAllBones();
            Canvas.updateAllPositions();
        },
    }),
    registerPaletteSlotProperty(Cube),
    new Property(Cube, "boolean", "shade", {
        default: true,
        label: "阴影",
        exposed: true,
        inputs: {
            element_panel: {
                input: {
                    label: '阴影',
                    type: 'checkbox'
                }
            }
        },
    }),
    new Property(Cube, "string", "climateColorMap", {
        default: '',
        label: "气候颜色映射",
        exposed: true,
        inputs: {
            element_panel: {
                input: {
                    label: '气候颜色映射',
                    type: 'text'
                }
            }
        },
    }),
    new Property(Cube, "boolean", "gradientShade", {
        default: false,
        label: "渐变阴影",
        exposed: true,
        inputs: {
            element_panel: {
                input: {
                    label: '渐变阴影',
                    type: 'checkbox'
                }
            }
        },
    }),
    new Property(Cube, "number", "renderPass", {
        default: -1,
        label: "渲染通道",
        exposed: true,
        options: {
            '-1': '默认',
            '0': '不透明',
            '1': '不透明（无剔除）',
            '2': '混合（无剔除）',
            '3': '透明',
            '4': '液体',
            '5': '表层土壤',
            '6': '元数据',
        },
        inputs: {
            element_panel: {
                input: {
                    label: '渲染通道',
                    type: 'select',
                    options: {
                        '-1': '默认',
                        '0': '不透明',
                        '1': '不透明（无剔除）',
                        '2': '混合（无剔除）',
                        '3': '透明',
                        '4': '液体',
                        '5': '表层土壤',
                        '6': '元数据',
                    }
                }
            }
        },
    }),
    new Property(Cube, "string", "seasonColorMap", {
        default: '',
        label: "季节颜色映射",
        exposed: true,
        inputs: {
            element_panel: {
                input: {
                    label: '季节颜色映射',
                    type: 'text'
                }
            }
        },
    }),
    new Property(Cube, "number", "unwrapMode", {
        default: 0,
        label: "UV 展开模式",
        exposed: false,
    }),
    new Property(Cube, "boolean", "autoUnwrap", {
        default: false,
        label: "自动展开 UV",
        exposed: false,
    }),
    new Property(Cube, "boolean", "disableRandomDrawOffset", {
        default: false,
        label: "禁用随机绘制偏移",
        exposed: false,
    }),
    new Property(Cube, "number", "unwrapRotation", {
        default: 0,
        label: "UV 展开旋转",
        exposed: false,
    }),
];

// Blockbench-only properties (not exported to VS JSON format)
new Property(Cube, "string", "clothingSlot", {
    default: '',
    label: "服装槽位",
    exposed: true,
    options: () => {
        const { getActiveSlotNames, getSlotDisplayName } = require('./attachments/presets');
        const slots = getActiveSlotNames();
        const options: {[key: string]: string} = { '': '无' };
        slots.forEach((slot: string) => {
            options[slot] = getSlotDisplayName(slot, true);
        });
        return options;
    },
    inputs: {
        element_panel: {
            input: {
                label: '服装槽位',
                type: 'select',
                options: () => {
                    const { getActiveSlotNames, getSlotDisplayName } = require('./attachments/presets');
                    const slots = getActiveSlotNames();
                    const options: {[key: string]: string} = { '': '无' };
                    slots.forEach((slot: string) => {
                        options[slot] = getSlotDisplayName(slot, true);
                    });
                    return options;
                }
            }
        }
    },
    onChange() {
        try {
            if ((Interface as any).Panels?.attachments_panel?.vue) {
                (Interface as any).Panels.attachments_panel.vue.updateAttachments();
            }
        } catch (e) {
            console.warn('Could not refresh attachments panel:', e);
        }
    },
});

new Property(Cube, "boolean", "backdrop");
registerStepParentTransformProperties(Cube);

registerOptionalInternalProperty(Cube, 'boolean', 'vs_has_rotation_origin', value => value === true);
registerOptionalInternalProperty(Cube, 'vector2', 'vs_uv', value => isFiniteVector(value, 2));

export const VS_TEXTURE_PROPS = [
    new Property(Texture, "string", "textureLocation", {
        default: '',
        label: "纹理位置",
        exposed: true,
        inputs: {
            element_panel: {
                input: {
                    label: '纹理位置',
                    type: 'text'
                }
            }
        },
    }),
];

export const VS_LOCATOR_PROPS = [
    new Property(Locator, "number", "rotationX", { default: 0 }),
    new Property(Locator, "number", "rotationY", { default: 0 }),
    new Property(Locator, "number", "rotationZ", { default: 0 }),
];

export const VS_FACE_PROPS = [
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "number", "glow"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "number", "reflectiveMode"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "array", "windMode"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "array", "windData"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "boolean", "autoUv", { default: false }),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "boolean", "snapUv", { default: false }),
];

/**
 * Extend Blockbench types with our custom properties
 */
declare global {
    interface Face {
        glow: boolean;
        reflectiveMode?: VS_ReflectiveMode;
        windMode?: [number, number, number, number];
        windData?: [number, number, number, number];
        autoUv?: boolean;
        snapUv?: boolean;
    }

    interface Texture {
        textureLocation?: string;
    }

    interface ModelProject {
        backDropShape?: string;
        allAngles?: boolean;
        entityTextureMode?: boolean;
        collapsedPaths?: string;
        singleTexture?: boolean;
        vsFormatConverted?: boolean;
    }

    interface Group {
        stepParentName?: string;
        paletteSlot?: number;
        clothingSlot?: string;
        backdrop?: boolean;
        vs_step_parent_local?: boolean;
        vs_has_step_parent_transform?: boolean;
        vs_step_parent_origin?: [number, number, number];
        vs_step_parent_rotation?: [number, number, number];
        vs_group_from?: [number, number, number];
        vs_group_to?: [number, number, number];
        vs_has_rotation_origin?: boolean;
        vs_zero_size_faces?: Partial<Record<VS_Direction, VS_Face>>;
        vs_uv?: [number, number];
    }

    interface Cube {
        stepParentName?: string;
        paletteSlot?: number;
        clothingSlot?: string;
        climateColorMap?: string;
        gradientShade?: boolean;
        renderPass?: number;
        seasonColorMap?: string;
        unwrapMode?: number;
        autoUnwrap?: boolean;
        disableRandomDrawOffset?: boolean;
        unwrapRotation?: number;
        backdrop?: boolean;
        vs_step_parent_local?: boolean;
        vs_has_step_parent_transform?: boolean;
        vs_step_parent_origin?: [number, number, number];
        vs_step_parent_rotation?: [number, number, number];
        vs_has_rotation_origin?: boolean;
        vs_uv?: [number, number];
    }

    interface Locator {
        rotationX?: number;
        rotationY?: number;
        rotationZ?: number;
    }
}
