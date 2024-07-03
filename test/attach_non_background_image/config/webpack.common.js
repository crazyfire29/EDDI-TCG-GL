const path = require("path");

module.exports = {
    entry: {
        rectangle_image: "./test/attach_non_background_image/draw_attach_non_background_image.ts"
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
        path: path.resolve(__dirname, "../../dist/attach_non_background_image"),
    },
};