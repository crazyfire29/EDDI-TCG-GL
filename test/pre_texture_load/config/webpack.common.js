const path = require("path");

module.exports = {
    entry: {
        rectangle_image: "./test/pre_texture_load/pre_texture_load.ts"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            '@resource': path.resolve(__dirname, '../../../resource'),
        },
        fallback: {
            "fs": false,
            "path": false
        }
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "../../dist/pre_texture_load"),
    },
};