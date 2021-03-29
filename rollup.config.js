import typescript from "rollup-plugin-typescript2";
import {terser} from "rollup-plugin-terser";
import nodeResolve from '@rollup/plugin-node-resolve';

export default [{
    external: ["three"],
    input: ["./src/main.ts"],
    output: [
        {
            file: "build/three-googly-eyes.js",
            format: "iife",
            name: "GooglyEyes", // the global which can be used in a browser
            globals: { "three": "THREE" }
        },
        {
            file: "build/three-googly-eyes.min.js",
            format: "iife",
            name: "GooglyEyes", // the global which can be used in a browser
            plugins: [terser()],
            globals: { "three": "THREE" }
        },
        {
            file: "build/three-googly-eyes.module.js",
            format: "es",
        }
    ],
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true,
            sourceMap: true,
            inlineSources: true,
        }),
        nodeResolve()
    ]
}];
