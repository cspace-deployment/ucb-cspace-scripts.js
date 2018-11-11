/* eslint-disable no-console */

/**
 * Search CollectionSpace.
 */

import cspaceAPI from 'cspace-api';
import yargs from 'yargs';
import formatObject from '../../helpers/formatObject';
import log from '../../helpers/log';
import getConnectionInfo from '../../helpers/getConnectionInfo';

const cspace = cspaceAPI(getConnectionInfo());

const {
  pretty,
  service,
  params: paramsJson,
} = yargs.argv;

const params = paramsJson ? JSON.parse(paramsJson) : undefined;

log('Using search params:', params);
log('Result:');

cspace.read(service, { params })
  .then((result) => {
    if (pretty) {
      console.log(formatObject(result.data));
    } else {
      console.log(JSON.stringify(result.data));
    }
  })
  .catch((error) => {
    log('ERROR:', error);

    process.exit(1);
  });
