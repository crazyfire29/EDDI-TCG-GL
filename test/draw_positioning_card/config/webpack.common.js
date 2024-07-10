const path = require("path");

module.exports = {
    entry: {
        rectangle_image: "./test/draw_positioning_card/draw_positioning_card.ts"
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
        path: path.resolve(__dirname, "../../dist/draw_positioning_card"),
    },
};