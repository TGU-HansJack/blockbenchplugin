import * as esbuild from "esbuild"
import { copyFileSync } from "fs"

if (process.argv.includes("--mode=dev")) {
	process.env.NODE_ENV = "development"
} else {
	process.env.NODE_ENV = "production"
}

const CONFIG: esbuild.BuildOptions = {
    entryPoints: ["./src/vintagestory.ts"],
    bundle: true,
    platform: "node",
    outfile: "./dist/vintagestory.js",
    banner: {
        js: "/*! Vintage Story Format Support — Anego Studios; original author: Darkluke1111; contributor: codename-B.\n * 汉化作者：HansJack（2026-11-04）。基于上游项目修改，按 GNU GPL v3 分发；不提供任何担保。\n * Upstream: https://github.com/anegostudios/blockbenchplugin — see LICENSE. */",
    },
    plugins: [

    ],
    format: "iife",
    loader: { ".png": "dataurl" },
};

const PROD_CONFIG: esbuild.BuildOptions = {
    ...CONFIG,
    minify: false,
};

const DEV_CONFIG: esbuild.BuildOptions = {
    ...CONFIG,
    minify: false,
    sourcemap: 'inline',
};

async function build() {
    if(process.env.NODE_ENV === "development") {
        console.log("Building in development mode")
        await esbuild.build(DEV_CONFIG);
        return;
    } else {
        console.log("Building in production mode")
        await esbuild.build(PROD_CONFIG);
        return;
    }
}

build().then(() => {
    copyFileSync("./icon.png", "./dist/icon.png");
    copyFileSync("./about.md", "./dist/about.md");
    copyFileSync("./LICENSE", "./dist/LICENSE");
    copyFileSync("./README.MD", "./dist/README.MD");
    copyFileSync("./header.png", "./dist/header.png");
})
