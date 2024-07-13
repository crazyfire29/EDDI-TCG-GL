const path = require("path");

module.exports = {
    entry: {
        rectangle_image: "./test/preload_test/preload_test.ts"
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
        fallback: {
            "fs": false,
            "path": false
        }
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "../../dist/preload_test"),
    },
};