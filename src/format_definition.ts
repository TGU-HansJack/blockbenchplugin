import { codecVS } from "./codec";
import { vsAnimationCodec } from "./animation_codec";
import icon from "../icon.png";

export function create_format(): ModelFormat { 
    const format =  new ModelFormat("formatVS", {
        name: "Vintage Story 基础格式",
        description: "Vintage Story 格式",
        target: "Vintage Story",
        format_page: {
            content: [
                { type: "text", text: "导入、编辑和导出 Vintage Story shape 模型，支持动画与附着点。" },
                { type: "h3", text: "快速入门" },
                {
                    type: "text",
                    text: [
                        "* 通过 **文件 > 打开模型** 打开 Vintage Story shape JSON 文件。",
                        "* 通过 **文件 > 新建 > Vintage Story 基础格式** 创建模型。",
                        "* 使用 **导入** 和 **导出** 菜单中的 Vintage Story 操作交换模型文件。",
                        "* 插件还提供 **附件** 工具和 **VS 面属性** 面板，用于调整自发光、反射模式和风动属性。",
                    ].join("\n"),
                },
                { type: "text", text: "[上游源代码](https://github.com/anegostudios/blockbenchplugin) · [上游问题跟踪](https://github.com/anegostudios/blockbenchplugin/issues) · 汉化作者：HansJack" },
            ],
        },
        codec: codecVS,
        icon: icon,
        box_uv: false,
        optional_box_uv: false,
        single_texture: false,
        single_texture_default: false,
        per_group_texture: false,
        per_texture_uv_size: true,
        model_identifier: false,
        legacy_editable_file_name: false,
        parent_model_id: false, //Use this for backdrops? false for now
        vertex_color_ambient_occlusion: false,
        animated_textures: false, // NOt sure if supported by VS
        bone_rig: true,
        centered_grid: true,
        rotate_cubes: true,
        stretch_cubes: false,
        integer_size: false,
        meshes: false,
        texture_meshes: false,
        locators: true,
        null_object: true,
        rotation_limit: false,
        rotation_snap: false,
        uv_rotation: true,
        java_face_properties: false,
        select_texture_for_particles: false,
        texture_mcmeta: false,
        bone_binding_expression: false, // Revisit for animation
        // Enables Blockbench's multi-file animation workflow: per-animation `path`/`saved_name`,
        // grouping by file in the ANIMATIONS panel, and per-file Save / Save All / Import.
        animation_files: true,
        texture_folder: true,
        image_editor: false, // Setting this to true removes the object outliner?!?!
        edit_mode: true,
        paint_mode: true,
        display_mode: false, // Only some Minecraft Skin stuff it seems
        animation_mode: true,
        pose_mode: false,
        animation_controllers: false, // VS has no animation-controller concept

        box_uv_float_size: false,
        java_cube_shading_properties: false,
        cullfaces: false, // Not sure if Vintage Story supports this
        render_sides: "double",
        euler_order: "XYZ",
        animation_loop_wrapping: true,
        quaternion_interpolation: false,
        per_animator_rotation_interpolation: false,
    });
    codecVS.format = format;
    // Route animation save/load/compile through the VS library codec (AnimationCodec.getCodec
    // checks Format.animation_codec first), so files use the VS format, not Bedrock's.
    // vsAnimationCodec is undefined on Blockbench builds without the AnimationCodec API.
    if (vsAnimationCodec) format.animation_codec = vsAnimationCodec;
    return format;
};