const path = require('path');
const root = path.resolve(__dirname);
const webpack = require('webpack');

module.exports = {
  resolve: { extensions: ['.ts', '.js', '.json'] },
  entry: path.join(root, 'index.ts'),
  devtool: 'source-map',
  output: {
    path: path.join(root, 'bundles'),
    publicPath: '/',
    filename: 'ng2-datepicker.umd.js',
    libraryTarget: 'umd',
    library: 'ng2-datepicker',
    umdNamedDefine: true
  },
  module: {
    rules: [
      { test: /\.ts$/, use: [
        { loader: 'awesome-typescript-loader', options: { configFilaName: path.join(root, 'tsconfig.json') } },
        { loader: 'angular2-template-loader' }
      ]},
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.sass$/, use: ['to-string-loader', 'css-loader', 'sass-loader'] },
      { test: /\.html$/, loader: 'html-loader', options: { minimize: true, removeAttributeQuotes: false, caseSensitive: true, customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ], customAttrAssign: [ /\)?\]?=/ ] } }
    ]
  },
  externals: [/^\@angular\//, /^rxjs\//]
};
