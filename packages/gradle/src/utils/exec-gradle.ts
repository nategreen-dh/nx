import { AggregateCreateNodesError, workspaceRoot } from '@nx/devkit';
import { ExecFileOptions, execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * This function assume that the gradle binary is in the workspace root
 * @returns gradle binary path, throws an error if gradlew is not found
 */
export function getWorkspaceRootGradleBinaryPath(): string {
  const gradleFile = process.platform.startsWith('win')
    ? 'gradlew.bat'
    : 'gradlew';
  const gradleBinaryPath = join(workspaceRoot, gradleFile);
  if (!existsSync(gradleBinaryPath)) {
    throw new Error('Gradle is not setup. Run "gradle init"');
  }

  return gradleBinaryPath;
}

/**
 * For gradle command, it needs to be run from the directory of the gradle binary
 * @returns gradle binary file name
 */
export function getGradleExecFile(): string {
  return process.platform.startsWith('win') ? '.\\gradlew.bat' : './gradlew';
}

/**
 * This function executes gradle with the given arguments
 * @param gradleBinaryPath absolute path to gradle binary
 * @param args args passed to gradle
 * @param execOptions exec options
 * @returns promise with the stdout buffer
 */
export function execGradleAsync(
  gradleBinaryPath: string,
  args: ReadonlyArray<string>,
  execOptions: ExecFileOptions = {}
): Promise<Buffer> {
  return new Promise<Buffer>((res, rej) => {
    const cp = execFile(gradleBinaryPath, args, {
      cwd: dirname(gradleBinaryPath),
      shell: true,
      windowsHide: true,
      env: process.env,
      ...execOptions,
    });

    let stdout = Buffer.from('');
    cp.stdout?.on('data', (data) => {
      stdout += data;
    });

    cp.on('exit', (code) => {
      if (code === 0) {
        res(stdout);
      } else {
        rej(
          new Error(
            `Executing Gradle with ${args.join(
              ' '
            )} failed with code: ${code}. \nLogs: ${stdout}`
          )
        );
      }
    });
  });
}

/**
 * This function recursively finds the nearest gradlew file in the workspace
 * @param filePath the path to start searching for gradlew file
 * @returns the relative path of the gradlew file to workspace root, throws an error if gradlew file is not found
 * It will return gradlew.bat file on windows and gradlew file on other platforms
 */
export function findGraldewFile(
  filePath: string,
  wr: string = workspaceRoot
): string {
  const fileDirectory = dirname(filePath);
  const gradlewPath = join(dirname(filePath), 'gradlew');
  const gradlewBatPath = join(dirname(filePath), 'gradlew.bat');
  if (process.platform.startsWith('win')) {
    if (existsSync(join(wr, gradlewBatPath))) {
      return gradlewBatPath;
    }
  } else {
    if (existsSync(join(wr, gradlewPath))) {
      return gradlewPath;
    }
  }

  if (!fileDirectory || fileDirectory === '.') {
    throw new AggregateCreateNodesError(
      [[null, new Error('No Gradlew file found. Run "gradle init"')]],
      []
    );
  }
  return findGraldewFile(fileDirectory, wr);
}
