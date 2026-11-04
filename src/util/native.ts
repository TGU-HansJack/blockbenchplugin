type FsModule = typeof import('fs');

let fs_module: FsModule | undefined;
let fs_denied = false;

function load_fs(): FsModule {
    if (!fs_module && !fs_denied) {
        fs_module = requireNativeModule('fs');
        fs_denied = !fs_module;
    }
    if (!fs_module) throw new Error('文件系统访问被拒绝，请重新加载插件并授予权限。');
    return fs_module;
}

export const fs = new Proxy({} as FsModule, {
    get: (_target, key) => Reflect.get(load_fs(), key),
});

let env_game_path: string | undefined | null = null;

function get_env_game_path(): string | undefined {
    if (env_game_path === null) {
        env_game_path = requireNativeModule('process', {
            message: '读取 VINTAGE_STORY 环境变量以查找游戏文件夹。',
        })?.env.VINTAGE_STORY;
    }
    return env_game_path;
}

export function get_game_path(): string {
    return Settings.get('game_path') || get_env_game_path() || '';
}
