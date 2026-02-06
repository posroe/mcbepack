import path from "path";
import { webpack, Configuration } from "webpack";
import { constants } from "@mcbepack/common";
import fs from "node:fs";

export function createWebpackConfig(): Configuration {
    if (fs.existsSync(path.join(process.cwd(), 'scripts', 'index.ts'))) {
        return {
            mode: 'development',
            entry: './scripts/index',
            target: 'node',
            output: {
                path: path.resolve(process.cwd(), 'src', 'behavior_pack', 'scripts'),
                filename: 'index.js',
                module: true,
                library: {
                    type: 'module'
                }
            },
            resolve: {
                extensions: ['.js', '.ts'],
            },
            resolveLoader: {
                modules: [
                    path.join(__dirname, '..', '..', 'node_modules'),
                    'node_modules'
                ]
            },
            externals: constants.packages.modules.map(module => ({
                [module]: module
            })),
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    },
                ],
            },
            experiments: {
                outputModule: true
            }
        };
    } else {
        return {
            mode: 'development',
            entry: './scripts/index',
            target: 'node',
            output: {
                path: path.resolve(process.cwd(), 'src', 'behavior_pack', 'scripts'),
                filename: 'index.js'
            },
            externals: constants.packages.modules.map(module => ({
                [module]: module
            })),
            resolve: {
                extensions: ['.js'],
            },
            experiments: {
                outputModule: true
            }
        };
    }
}

export function createCompiler() {
    return webpack(createWebpackConfig());
}
