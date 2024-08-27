import { connectToNxDb, ExternalObject } from '../native';
import { workspaceDataDirectory } from './cache-directory';
import { version as NX_VERSION } from '../../package.json';

let dbConnection: ExternalObject<any>;

const dbConnectionMap = new Map<string, ExternalObject<any>>();

export function getDbConnection(opts?: {
  directory?: string;
  dbName?: string;
}) {
  opts.directory ??= workspaceDataDirectory;
  const key = `${opts.directory}:${opts.dbName ?? 'default'}`;
  const connection =
    dbConnectionMap.get(key) ??
    connectToNxDb(opts.directory, NX_VERSION, opts.dbName);
  dbConnectionMap.set(key, connection);
  return connection;
}
