const path = require("path");

module.exports = {
    entry: {
        rectangle_image: "./test/config_window_size/draw_window_size.ts"
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
        path: path.resolve(__dirname, "../../dist/config_window_size"),
    },
};