/**
 * Save movement records that were updated on or after a given date, and have a non-null crate. The
 * movements are saved with an empty payload, to leave them unchanged.
 *
 * This script is used to force any objects that are related to the movements to have their
 * computed current location and crate values recalculated. This addresses the issues HM-36 and
 * BP-19.
 *
 * Note that the movement records that are saved will have their updatedAt and updatedBy fields set
 * to the ID of the user who runs this script, and the time that the script saves the record.
 */

import cspaceAPI from 'cspace-api';
import yargs from 'yargs';
import log from '../../helpers/log';
import getConnectionInfo from '../../helpers/getConnectionInfo';

const cspace = cspaceAPI(getConnectionInfo());

const {
  from: fromDate,
  to: toDate,
  'crate-schema': crateSchema,
} = yargs.argv;

if (!fromDate) {
  log('ERROR: from date not specified');

  process.exit(1);
}

if (!toDate) {
  log('ERROR: to date not specified');

  process.exit(1);
}

if (!crateSchema) {
  // e.g. movements_anthropology, movements_bampfa

  log('ERROR: crate schema not specified');

  process.exit(1);
}

cspace.read('movements', {
  params: {
    pgSz: 0,
    as: `collectionspace_core:updatedAt >= TIMESTAMP "${fromDate}T00:00:00.000" AND collectionspace_core:updatedAt <= TIMESTAMP "${toDate}T23:59:59.999" AND ${crateSchema}:crate IS NOT NULL`,
    sortBy: 'collectionspace_core:updatedAt ASC',
    wf_deleted: false,
  },
})
  .then((result) => {
    let items = result.data['ns2:abstract-common-list']['list-item'];

    if (!items) {
      return undefined;
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    log(`Found ${items.length} movements:`);

    return items.reduce((promise, item) => promise.then(() => {
      log(item.csid);

      return cspace.update(`movements/${item.csid}`, {
        data: {
          document: {
            '@name': 'movements',
            'ns2:movements_common': {
              '@xmlns:ns2': 'http://collectionspace.org/services/movement',
            },
          },
        },
      });
    }), Promise.resolve());
  })
  .catch(error => log('ERROR:', error));
