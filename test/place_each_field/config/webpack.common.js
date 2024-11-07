const path = require("path");

module.exports = {
    entry: {
        cube: "./test/place_each_field/place_each_field.ts",
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
        path: path.resolve(__dirname, "../../dist/place_each_field"),
    },
};