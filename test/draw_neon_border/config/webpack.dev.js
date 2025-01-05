const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "../"), // static 디렉토리 설정
            },
            {
                directory: path.join(__dirname, "../../../resource"), // 추가된 디렉토리 설정
            },
        ],
        hot: true,
        historyApiFallback: true,
    },
});