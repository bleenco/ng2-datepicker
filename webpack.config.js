const path = require('path');
const root = path.resolve(__dirname);
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  context: __dirname,
  target: 'node',
  mode: 'production',
  resolve: { extensions: ['.ts', '.js'] },
  entry: {
    server: path.join(root, 'server.ts')
  },
  output: {
    path: path.join(root, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{ test: /\.ts$/, loaders: ['ts-loader?silent=true&configFile=tsconfig.server.json'] }]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        terserOptions: {
          output: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  stats: {
    assets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    timings: true,
    children: false,
    cachedAssets: false,
    chunkOrigins: false,
    modules: false,
    warnings: false
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
};
