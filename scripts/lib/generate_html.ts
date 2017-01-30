import * as fs from 'fs-extra';
import * as path from 'path';
import * as _ from 'lodash';
import * as chalk from 'chalk';
import { Observable } from 'rxjs';
import { getConfig } from './utils';

const config = getConfig();
const index = path.resolve(__dirname, '../../src/index.html');
const content = _.template(fs.readFileSync(index).toString());

export function generateDevHtml(dir: string): Observable<any> {
  const dest = path.resolve(dir, 'index.html');
  return new Observable(observer => {
    const styles = config.styles;
    const scripts = ['vendor.js', 'main.js'];
    fs.outputFile(dest, content({ styles: styles.map(style => style.dest.replace('dist/', '')), scripts: scripts }), err => {
      if (err) {
        observer.error(err);
      }
      observer.complete();
    });
  });
};

export function generateProdHtml(dir: string): Observable<any> {
  const dest = path.resolve(dir, 'index.html');
  return new Observable(observer => {
    const styles = config.styles;
    const scripts = ['app.js'];
    fs.outputFile(dest, content({ styles: styles.map(style => style.dest.replace('dist/', '')), scripts: scripts }), err => {
      if (err) {
        observer.error(err);
      }
      observer.complete();
    });
  });
};

export function generateFromStringHtml(html: string, url: string): void {
  const styles = config.styles;
  const scripts = ['app.js'];
  let parsedHtml = _.template(html);
  url = url === '/' ? 'index' : url;
  let destinationFile = path.resolve(__dirname, `../../dist/${url}.html`);
  fs.outputFileSync(destinationFile, parsedHtml({ styles: styles.map(style => style.dest.replace('dist/', '')), scripts: scripts }));
}
