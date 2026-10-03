/**
 * Preset configurations for different clothing/attachment systems
 */

export interface AttachmentPreset {
    name: string;
    description: string;
    slots: string[];
}

/**
 * Used for Glint character customization
 */
export const GLINT_PRESET: AttachmentPreset = {
    name: "Glint",
    description: "Glint 角色自定义槽位",
    slots: [
        'Outerwear',
        'Top',
        'Bottoms',
        'Shoes',
        'Gloves',
        'Headwear',
        'Eyebrows',
        'Eyes',
        'Nose',
        'Mouth',
        'FacialHair',
        'Earrings',
        'Ears',
        'FaceItem',
        'Hair'
    ]
};

/**
 * Vintage Story Seraph clothing system
 */
export const VINTAGE_STORY_PRESET: AttachmentPreset = {
    name: "Vintage Story",
    description: "Vintage Story 炽天使服装及护甲槽位",
    slots: [
        // Clothing slots
        'Arm',
        'Emblem',
        'Face',
        'Ears',
        'Hair',
        'Nose',
        'Foot',
        'Hand',
        'Head',
        'LowerBody',
        'Neck',
        'Shoulder',
        'UpperBody',
        'UpperBodyOver',
        'Waist',
        // Armor slots
        'Armor Body',
        'Armor Head',
        'Armor Legs'
    ]
};

/**
 * Available preset configurations
 */
export const PRESETS: { [key: string]: AttachmentPreset } = {
    'glint': GLINT_PRESET,
    'vintage_story': VINTAGE_STORY_PRESET
};

const SLOT_LABELS: Record<string, string> = {
    Outerwear: '外套', Top: '上衣', Bottoms: '下装', Shoes: '鞋',
    Gloves: '手套', Headwear: '头饰', Eyebrows: '眉毛', Eyes: '眼睛',
    Nose: '鼻子', Mouth: '嘴巴', FacialHair: '胡须', Earrings: '耳饰',
    Ears: '耳朵', FaceItem: '面部饰品', Hair: '头发', Arm: '手臂',
    Emblem: '徽章', Face: '面部', Foot: '脚', Hand: '手', Head: '头部',
    LowerBody: '下半身', Neck: '颈部', Shoulder: '肩部', UpperBody: '上半身',
    UpperBodyOver: '上半身外层', Waist: '腰部',
    'Armor Body': '身体护甲', 'Armor Head': '头部护甲', 'Armor Legs': '腿部护甲'
};

export function getSlotDisplayName(slot: string, includeCode = false): string {
    const label = SLOT_LABELS[slot];
    if (!label) return slot;
    return includeCode ? `${label} (${slot})` : label;
}

/**
 * Path segment to slot name mappings for different systems.
 * Note: Armor paths are handled separately in inferClothingSlotFromPath()
 * before these mappings are checked.
 */
const PATH_TO_SLOT_MAPPINGS: { [key: string]: string } = {
    // Vintage Story clothing paths
    'upperbody': 'UpperBody',
    'upperbodyover': 'UpperBodyOver',
    'lowerbody': 'LowerBody',
    'head': 'Head',
    'face': 'Face',
    'neck': 'Neck',
    'shoulder': 'Shoulder',
    'hand': 'Hand',
    'foot': 'Foot',
    'waist': 'Waist',
    'arm': 'Arm',
    'emblem': 'Emblem',
    'faceitem': 'FaceItem',

    // Glint paths
    'outerwear': 'Outerwear',
    'top': 'Top',
    'bottom': 'Bottoms',
    'bottoms': 'Bottoms',
    'boot': 'Shoes',
    'boots': 'Shoes',
    'shoes': 'Shoes',
    'glove': 'Gloves',
    'gloves': 'Gloves',
    'headwear': 'Headwear',
    'eyebrows': 'Eyebrows',
    'eyes': 'Eyes',
    'nose': 'Nose',
    'mouth': 'Mouth',
    'facialhair': 'FacialHair',
    'earring': 'Earrings',
    'earrings': 'Earrings',
    'ears': 'Ears',

    // Hair (shared)
    'hair': 'Hair',
    'hair-base': 'Hair',
    'hair-extra': 'Hair',
    'hair-face': 'Hair',
};

/**
 * Infers the clothing slot from a file path
 * @param filePath Full path to the imported file
 * @returns The inferred clothing slot name, or null if none could be determined
 */
export function inferClothingSlotFromPath(filePath: string): string | null {
    if (!filePath) return null;

    // Normalize path separators and convert to lowercase
    const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
    const pathSegments = normalizedPath.split('/');

    // Check for armor paths (e.g., .../armor/.../body.json)
    if (pathSegments.includes('armor')) {
        // Get the filename without extension
        const filename = pathSegments[pathSegments.length - 1].replace(/\.[^.]+$/, '');

        // Map armor filenames to slots
        if (filename === 'body') return 'Armor Body';
        if (filename === 'head') return 'Armor Head';
        if (filename === 'legs') return 'Armor Legs';
    }

    // Check each path segment against mappings (from most specific to least)
    for (let i = pathSegments.length - 1; i >= 0; i--) {
        const segment = pathSegments[i];
        if (PATH_TO_SLOT_MAPPINGS[segment]) {
            return PATH_TO_SLOT_MAPPINGS[segment];
        }
    }

    return null;
}

/**
 * Get the active slot names based on the current settings
 * @returns Array of slot names to use for attachment detection
 */
export function getActiveSlotNames(): string[] {
    // Try to get from settings
    try {
        const presetKey = Settings.get('attachment_preset') || 'vintage_story';

        if (presetKey === 'custom') {
            // Custom slots from settings
            const customSlots = Settings.get('attachment_custom_slots');
            if (customSlots && Array.isArray(customSlots) && customSlots.length > 0) {
                return customSlots;
            }
            // Fall back to VS if custom slots not configured
            return VINTAGE_STORY_PRESET.slots;
        }

        const preset = PRESETS[presetKey];
        if (preset) {
            return preset.slots;
        }
    } catch (e) {
        console.warn('Error getting attachment preset from settings:', e);
    }

    // Default to VS
    return VINTAGE_STORY_PRESET.slots;
}
