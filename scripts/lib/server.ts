import * as path from 'path';
import * as chokidar from 'chokidar';
import * as chalk from 'chalk';
import { Observable, Subscription } from 'rxjs';
import { generateDevHtml } from './generate_html';
import { copyPublic } from './utils';
import { Build } from './build';
import { renderSass } from './css';
import { removeModuleIdFromComponents } from './helpers';
import { getPort, printLine, getConfig } from './utils';
const open = require('open');

export class Server {
  config: any;
  port: number;
  private builder: Build;

  constructor() {
    this.config = getConfig();
    this.builder = new Build();
  }

  watch(tempDir: string): Observable<any> {
    return new Observable(observer => {
      let building: Subscription = null;
      let stylesArr = this.config.styles.map(s => path.basename(s.src));

      const watcher = chokidar.watch(path.resolve(__dirname, '../../src'), {
        persistent: true
      });

      const publicWatcher = chokidar.watch(path.resolve(__dirname, '../../public'), {
        persistent: true
      });

      watcher.on('ready', () => {
        printLine();

        removeModuleIdFromComponents().then(() => getPort()).then(port => {
          copyPublic(tempDir)
          .concat(generateDevHtml(tempDir))
          .concat(renderSass(this.config.styles, tempDir))
          .concat(this.builder.buildDev(tempDir, port)).subscribe(data => {
            observer.next(data);
          }, err => {
            console.log(chalk.red(err));
          }, () => {
            open(`http://localhost:${port}`);
            watcher.on('change', (file, stats) => {
              let ext: string = path.extname(file);
              let basename: string = path.basename(file);
              observer.next(chalk.blue(`${basename} changed...`));
              switch (ext) {
                case '.html':
                  if (basename === 'index.html') {
                    generateDevHtml(tempDir).subscribe(data => observer.next(data));
                  } else {
                    this.builder.cache = null;
                    if (this.builder.building) {
                      building.unsubscribe();
                    }
                    building = this.builder.buildDevMain(tempDir).subscribe(data => observer.next(data));
                  }
                  break;
                case '.ts':
                  if (this.builder.building) {
                    building.unsubscribe();
                  }
                  building = this.builder.buildDevMain(tempDir).subscribe(data => observer.next(data));
                  break;
                case '.sass':
                  if (stylesArr.indexOf(basename) !== -1) {
                    renderSass(this.config.styles, tempDir).subscribe(data => { observer.next(data); });
                  } else {
                    if (this.builder.building) {
                      building.unsubscribe();
                    }
                    building = this.builder.buildDevMain(tempDir).subscribe(data => observer.next(data));
                  }
                  break;
                case '.scss':
                  if (stylesArr.indexOf(basename) !== -1) {
                    renderSass(this.config.styles, tempDir).subscribe(data => { observer.next(data); });
                  } else {
                    if (this.builder.building) {
                      building.unsubscribe();
                    }
                    building = this.builder.buildDevMain(tempDir).subscribe(data => observer.next(data));
                  }
                  break;
                default:
                  break;
              }
            });

            publicWatcher.on('add', () => copyPublic(tempDir).subscribe(data => console.log(data)));
            publicWatcher.on('change', () => copyPublic(tempDir).subscribe(data => console.log(data)));
            publicWatcher.on('remove', () => copyPublic(tempDir).subscribe(data => console.log(data)));
          });
        });
      });
    });
  }
}
