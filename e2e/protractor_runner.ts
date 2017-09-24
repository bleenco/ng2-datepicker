import { start, protractor, killAllProcesses } from './utils/process';
import { resolve } from 'path';

process.exitCode = 255;

Promise.resolve()
  .then(() => process.chdir(resolve(__dirname, '..')))
  .then(() => start())
  .then(() => protractor())
  .then(output => process.exitCode = output.code)
  .then(() => killAllProcesses())
  .then(() => process.exit(process.exitCode))
  .catch(err => {
    killAllProcesses()
      .then(() => console.error(err))
      .then(() => process.exit(1));
  });
