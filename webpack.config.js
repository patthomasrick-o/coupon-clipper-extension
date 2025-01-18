const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // Entry points for the application
  entry: {
    popup: "./src/popup/Popup.tsx",
    background: "./src/background/Background.ts",
    clipper: "./src/contentScripts/Clipper.ts",
  },

  // Source maps for easier debugging
  devtool: "source-map",

  // Output configuration
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },

  // Module resolution settings
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
  },

  // Module rules for different file types
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // Plugins configuration
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
  ],

  // Performance settings
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  // Development server configuration
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    open: true,
  },
};
