/**
 * Create object records with a range of object numbers.
 */

import cspaceAPI from 'cspace-api';
import log from '../../helpers/log';
import getConnectionInfo from '../../helpers/getConnectionInfo';
import objectNumbers from '../../helpers/objectNumberGenerator';
import { computeSortableObjectNumber } from '../../helpers/pahma';

const cspace = cspaceAPI(getConnectionInfo());
const [prefix, startNum, endNum] = process.argv.slice(2);

// Create records one at a time, instead of concurrently in parallel. This reduces load on the
// server, reduces memory usage on the client, makes it easier to cancel and recover if something
// looks like it's going wrong.

const createObjects = async (objectNumberIterator) => {
  for (const objectNumber of objectNumberIterator) { // eslint-disable-line no-restricted-syntax
    try {
      await cspace.create('collectionobjects', {
        data: `<?xml version="1.0"?>
          <document name="collectionobjects">
            <ns2:collectionobjects_common xmlns:ns2="http://collectionspace.org/services/collectionobject">
              <objectNumber>${objectNumber}</objectNumber>
            </ns2:collectionobjects_common>
            <ns2:collectionobjects_pahma xmlns:ns2="http://collectionspace.org/services/collectionobject/local/pahma">
              <pahmaTmsLegacyDepartment>Cat. 15 - Photographic negatives</pahmaTmsLegacyDepartment>
              <sortableObjectNumber>${computeSortableObjectNumber(objectNumber)}</sortableObjectNumber>
            </ns2:collectionobjects_pahma>
          </document>`,
      });

      log(`Created ${objectNumber}`);
    } catch (error) {
      log(`Error creating ${objectNumber}`, error);
    }
  }
};

createObjects(objectNumbers(prefix, parseInt(startNum, 10), parseInt(endNum, 10)))
  .then(() => log('Done'));
