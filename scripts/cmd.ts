import 'reflect-metadata';
import * as chalk from 'chalk';
import * as path from 'path';
import { argv } from 'optimist';
import { Build } from './lib/build';
import { Server } from './lib/server';
import { generateDevHtml, generateProdHtml } from './lib/generate_html';
import { renderSass } from './lib/css';
import { gzipApp } from './lib/gzip';
import { clean, copyPublic, getConfig, setupTempDir, printLine } from './lib/utils';
import { removeModuleIdFromComponents, addModuleIdToComponents } from './lib/helpers';

const build: Build = new Build();
const server: Server = new Server();

let config = getConfig();
let dist = path.resolve(__dirname, '../dist');

if (argv.build) {
  printLine();
  console.time('Build');
  removeModuleIdFromComponents().then(() => {
    clean('dist')
      .concat(copyPublic('dist'))
      .concat(generateProdHtml('dist'))
      .concat(renderSass(config.styles, dist))
      .concat(build.buildProd)
      .concat(clean('dist/src'))
      .concat(clean('aot'))
      .concat(gzipApp()).subscribe(data => {
        console.log(data);
      }, err => {
        console.error(err);
      }, () => {
        console.timeEnd('Build');
        printLine();
      });
  });
}

if (argv.serve) {
  printLine();
  setupTempDir().then(tempDir => {
    server.watch(tempDir).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(chalk.red(`✖ Compile error: ${err}`));
    });
  });
}

if (argv.prerender) {
  printLine();
  console.time('Prerender');
  addModuleIdToComponents()
    .then(() => {
      const prerender = require('./lib/prerender');
      return prerender.runPrerender();
    })
    .then(() => removeModuleIdFromComponents())
    .then(() => {
      printLine();
      console.timeEnd('Prerender');
      printLine();
    })
    .catch(err => {
      console.error(err);
    });
}
