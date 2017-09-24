const path = require('path');
const root = path.resolve(__dirname);
const webpack = require('webpack');

module.exports = {
  resolve: { extensions: ['.js'] },
  entry: path.join(root, 'lib/index.js'),
  devtool: 'source-map',
  output: {
    path: path.join(root, 'bundles'),
    publicPath: '/',
    filename: 'ng2-datepicker.umd.js',
    libraryTarget: 'umd',
    library: 'ng2-datepicker',
    umdNamedDefine: true
  },
  externals: [/^\@angular\//, /^rxjs\//]
};
