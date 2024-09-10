---
title: 'import - CLI command'
description: 'Import part of another repository into this repository, preserving git history.'
---

# import

Import part of another repository into this repository, preserving git history.

## Usage

```shell
nx import [sourceRepository] [destinationDirectory]
```

Install `nx` globally to invoke the command directly using `nx`, or use `npx nx`, `yarn nx`, or `pnpm nx`.

## Options

| Option                   | Type    | Description                                                                 |
| ------------------------ | ------- | --------------------------------------------------------------------------- |
| `--depth`                | number  | The depth to clone the source repository (limit this for faster git clone). |
| `--destinationDirectory` | string  | The directory in the current workspace to import into.                      |
| `--help`                 | boolean | Show help.                                                                  |
| `--interactive`          | boolean | Interactive mode. (Default: `true`)                                         |
| `--ref`                  | string  | The branch from the source repository to import.                            |
| `--sourceDirectory`      | string  | The directory in the source repository to import from.                      |
| `--sourceRepository`     | string  | The remote URL of the source to import.                                     |
| `--verbose`              | boolean | Prints additional information about the commands (e.g., stack traces).      |
| `--version`              | boolean | Show version number.                                                        |
