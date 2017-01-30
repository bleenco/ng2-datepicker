import * as path from 'path';
import * as fs from 'fs-extra';
import * as sass from 'node-sass';
import * as chalk from 'chalk';
import { Observable } from 'rxjs';

export function renderSass(files: any, tempDir?: string): Observable<string> {
  return Observable.create(observer => {
    let start: Date = new Date();

    return Observable.merge(...files.map((pair: any) => {
      let src = path.resolve(path.resolve(__dirname, '../../'), pair.src);
      let dest = path.resolve(tempDir ? path.resolve(tempDir) : path.resolve(__dirname, '../../'), pair.dest.replace('dist/', ''));
      return compileSass(src, dest);
    })).subscribe(() => { }, err => {
      observer.error(err);
      observer.complete();
    }, () => {
      let time: number = new Date().getTime() - start.getTime();
      observer.next(`${chalk.green('✔')} SASS Build Time: ${time}ms`);
      observer.complete();
    });
  });
}

export function compileSass(srcPath: string, destPath: string): Observable<string> {
  return Observable.create(observer => {
    if (!fs.existsSync(srcPath)) {
      observer.complete();
      return;
    }

    sass.render({ file: srcPath, outputStyle: 'compressed' }, (err, result) => {
      if (err) {
        observer.error(err);
        observer.complete();
      }

      fs.outputFile(destPath, result.css, writeErr => {
        if (writeErr) {
          observer.error(err);
          observer.complete();
        }

        observer.complete();
      });
    });
  });
}
