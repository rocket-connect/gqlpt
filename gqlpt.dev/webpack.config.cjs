require("dotenv").config({ path: "./.env" });
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  mode: "none",
  entry: path.join(__dirname, "src", "index.tsx"),
  context: path.join(__dirname),
  target: "web",
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".json", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
        options: { transpileOnly: true },
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
        exclude: /\.module\.css$/,
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify(process.env.API_URL),
      },
    }),
    new MonacoWebpackPlugin({
      languages: ["json", "graphql"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    static: {
      directory: "dist",
    },
    compress: true,
    port: process.env.WEBPACK_DEV_PORT || 3000,
  },
};
