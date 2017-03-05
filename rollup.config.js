import path from 'path';
import { readFileSync } from 'fs';
import node from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';

let pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json')));

export default {
  entry: 'ng2-datepicker.js',
  dest: 'bundle/ng2-datepicker.umd.js',
  format: 'umd',
  moduleName: 'ng2-datepicker',
  context: 'this',
  plugins: [ node(), buble(), commonjs() ],
  external: Object.keys(pkg.devDependencies).concat(Object.keys(pkg.dependencies)),
  globals: {
    '@angular/core': 'vendor._angular_core',
    '@angular/common': 'vendor._angular_common',
    '@angular/platform-browser': 'vendor._angular_platformBrowser',
    '@angular/platform-browser-dynamic': 'vendor._angular_platformBrowserDynamic',
    '@angular/router': 'vendor._angular_router',
    '@angular/http': 'vendor._angular_http',
    '@angular/forms': 'vendor._angular_forms',
    'rxjs': 'vendor.rxjs',
    'moment': 'vendor.moment',
    'ng2-slimscroll': 'vendor.ng2_slimscroll'
  }
}
