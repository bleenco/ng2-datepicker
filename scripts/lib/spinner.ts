import * as chalk from 'chalk';
const clispinner = require('cli-progress-spinner');

let spinner;

export function start(msg = ''): void {
  if (spinner) { spinner.stop(); }
  spinner = clispinner({
    text: msg,
    color: 'blue',
    spinner: 'growVertical',
    enabled: true,
    stream: process.stdout
  }).start();
}

export function stop(): void {
  spinner.stop();
}

export function clear(): void {
  spinner.clear();
}
