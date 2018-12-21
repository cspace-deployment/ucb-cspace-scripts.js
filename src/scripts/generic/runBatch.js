/* eslint-disable no-console */

import cspaceAPI from 'cspace-api';
import yargs from 'yargs';
import get from 'lodash/get';
import log from '../../helpers/log';
import getConnectionInfo from '../../helpers/getConnectionInfo';
import forEach from '../../helpers/forEach';

const cspace = cspaceAPI(getConnectionInfo());

const {
  batchCsid,
  docType,
  service,
  params: paramsJson,
} = yargs.argv;

const params = paramsJson ? JSON.parse(paramsJson) : undefined;

log('Using search params:', params);

forEach(cspace, service, params, (item) => {
  const config = {
    data: {
      'ns2:invocationContext': {
        '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
        docType,
        mode: 'single',
        singleCSID: item.csid,
      },
    },
  };

  return cspace.create(`batch/${batchCsid}`, config)
    .then((response) => {
      let numAffected = parseInt(get(response, ['data', 'ns2:invocationResults', 'numAffected']), 10);

      if (Number.isNaN(numAffected)) {
        numAffected = 0;
      }

      if (numAffected > 0) {
        log(`Updated: ${item.csid}`);
      }
    })
    .catch((error) => {
      log(`Error: ${item.csid}`);
      log(error);

      throw error;
    });
});
