const path = require("path");

module.exports = {
    entry: {
        rectangle_image: "./test/add_main_renderer/add_main_renderer.ts"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "../../dist/add_main_renderer"),
    },
};