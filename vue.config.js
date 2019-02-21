const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: {
    output: {
      filename: "js/app.js"
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: "webconfig",
          to: "./"
        }
      ])
    ],
    devtool: "eval"
  }
};