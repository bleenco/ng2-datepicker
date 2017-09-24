import * as child_process from 'child_process';
import { blue, yellow } from 'chalk';
import * as treeKill from 'tree-kill';

interface ExecOptions {
  silent?: boolean;
}

interface ProcessOutput {
  stdout: string;
  stderr: string;
  code: number;
}

let _processes: child_process.ChildProcess[] = [];

export function start() {
  return _run({ silent: true }, 'npm', ['run', 'start:noopen']);
}

export function protractor() {
  return _run({ silent: false }, 'npm', ['run', 'test:e2e']);
}

export function killAllProcesses(signal = 'SIGTERM'): Promise<void> {
  return Promise.all(_processes.map(process => killProcess(process.pid)))
    .then(() => { _processes = []; });
}

export function killProcess(pid: number): Promise<null> {
  return new Promise((resolve, reject) => {
    treeKill(pid, 'SIGTERM', err => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

function _run(options: ExecOptions, cmd: string, args: string[]): Promise<ProcessOutput> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const cwd = process.cwd();
    console.log(
      `==========================================================================================`
    );

    args = args.filter(x => x !== undefined);
    const flags = [
      options.silent || false
    ]
      .filter(x => !!x)
      .join(', ')
      .replace(/^(.+)$/, ' [$1]');

    console.log(blue(`Running \`${cmd} ${args.map(x => `"${x}"`).join(' ')}\`${flags}...`));
    console.log(blue(`CWD: ${cwd}`));
    const spawnOptions: any = {cwd};

    if (process.platform.startsWith('win')) {
      args.unshift('/c', cmd);
      cmd = 'cmd.exe';
      spawnOptions['stdio'] = 'pipe';
    }

    const childProcess = child_process.spawn(cmd, args, spawnOptions);

    _processes.push(childProcess);

    childProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();

      if (output.includes('webpack: Compiled successfully.')) {
        resolve();
      }

      stdout += output;
      if (options.silent) {
        return;
      }

      data.toString()
        .split(/[\n\r]+/)
        .filter(line => line !== '')
        .forEach(line => console.log('  ' + line));
    });

    childProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
      if (options.silent) {
        return;
      }

      data.toString()
        .split(/[\n\r]+/)
        .filter(line => line !== '')
        .forEach(line => console.error(yellow('  ' + line)));
    });

    childProcess.on('close', (code: number) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
        reject(err);
      }
    });
  });
}
