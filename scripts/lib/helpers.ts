import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const appDir = path.resolve(__dirname, '../../');

export function addModuleIdToComponents(): Promise<null> {
  return new Promise(resolve => {
    let srcFiles = glob.sync(`${appDir}/**/*.component.ts`);
    srcFiles.forEach(srcFile => {
      let contents = fs.readFileSync(srcFile).toString().split('\n');
      let index = contents.findIndex(line => line === '@Component({');
      if (index !== -1) {
        contents[index] = `${contents[index]}\n  moduleId: module.id,`;
        fs.writeFileSync(srcFile, contents.join('\n'), 'utf8');
      }
    });

    resolve();
  });
}

export function removeModuleIdFromComponents(): Promise<null> {
  return new Promise(resolve => {
    let srcFiles = glob.sync(`${appDir}/**/*.component.ts`);
    srcFiles.forEach(srcFile => {
      let contents = fs.readFileSync(srcFile).toString().split('\n');
      let index = contents.findIndex(line => line === '  moduleId: module.id,');
      if (index !== -1) {
        contents.splice(index, 1);
        fs.writeFileSync(srcFile, contents.join('\n'), 'utf8');
      }
    });

    resolve();
  });
}

export function timeHuman(ms: number): string {
  let x = ms / 1000;
  let seconds = x % 60;
  x /= 60;
  let minutes = x % 60;

  if (minutes >= 1) {
    return `${Math.round(minutes)}min ${parseFloat(<any>seconds).toFixed(2)}s`;
  } else {
    return `${parseFloat(<any>seconds).toFixed(2)}s`;
  }
}
