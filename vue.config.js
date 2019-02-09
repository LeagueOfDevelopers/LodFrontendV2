const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: "webconfig",
          to: "./"
        }
      ])
    ],
    devtool: "inline-source-map"
  }
};