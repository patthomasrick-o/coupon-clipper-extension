const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    popup: "./src/popup.tsx",
    background: "./src/background.ts",
    content: "./src/content.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "[name].js",
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
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: "",
        },
      ],
    }),
  ],
};
