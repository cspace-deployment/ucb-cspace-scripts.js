import yargs from 'yargs';
import get from 'lodash/get';
import log from './log';

const {
  pageSize,
  startPage,
} = yargs.argv;

const pgSz = (pageSize && pageSize > 0) ? pageSize : 100;

const processPage = (cspace, service, params, callback) => cspace.read(service, { params })
  .then((result) => {
    let itemsInPage = parseInt(get(result, ['data', 'ns2:abstract-common-list', 'itemsInPage']), 10);

    if (Number.isNaN(itemsInPage)) {
      itemsInPage = 0;
    }

    let processPagePromise;

    if (itemsInPage === 0) {
      processPagePromise = Promise.resolve();
    } else {
      let items = get(result, ['data', 'ns2:abstract-common-list', 'list-item']);

      if (!Array.isArray(items)) {
        items = [items];
      }

      processPagePromise = items.reduce((promise, item) => promise
        .then(() => Promise.resolve(callback(item))), Promise.resolve());
    }

    return processPagePromise.then(() => itemsInPage);
  });

export default async (cspace, service, params, callback) => {
  let pgNum = startPage || 0;
  let itemsInPage;

  do {
    const pageParams = Object.assign({}, params, {
      pgNum,
      pgSz,
      sortBy: 'collectionspace_core:createdAt',
    });

    log(`processing page ${pgNum} with size ${pgSz}`);

    try {
      itemsInPage = await processPage(cspace, service, pageParams, callback);
    } catch (error) {
      log(error);

      break;
    }

    pgNum += 1;
  } while (itemsInPage === pgSz);
};
