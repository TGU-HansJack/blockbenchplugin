// Display labels only: the slot ID remains unchanged in models and resource matching.
const SLOT_LABELS: Record<string, string> = {
    Outerwear: '外套',
    Top: '上衣',
    Bottoms: '下装',
    Shoes: '鞋子',
    Gloves: '手套',
    Headwear: '头饰',
    Eyebrows: '眉毛',
    Eyes: '眼睛',
    Nose: '鼻子',
    Mouth: '嘴部',
    FacialHair: '胡须',
    Earrings: '耳饰',
    Ears: '耳朵',
    FaceItem: '面部饰品',
    Hair: '头发',
    Arm: '手臂',
    Emblem: '徽章',
    Face: '面部',
    Foot: '脚部',
    Hand: '手部',
    Head: '头部',
    LowerBody: '下身',
    Neck: '颈部',
    Shoulder: '肩部',
    UpperBody: '上身',
    UpperBodyOver: '上身外层',
    Waist: '腰部',
    'Armor Body': '躯干护甲',
    'Armor Head': '头部护甲',
    'Armor Legs': '腿部护甲',
};

export function getSlotLabel(slot: string): string {
    const label = Object.hasOwn(SLOT_LABELS, slot) ? SLOT_LABELS[slot] : undefined;
    return label ? `${label}（${slot}）` : slot;
}
