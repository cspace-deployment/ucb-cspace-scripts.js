import cspaceAPI from 'cspace-api';
import get from 'lodash/get';
import copyBlob from '../../helpers/copyBlob';
import getDataFromXmlResponse from '../../helpers/getDataFromXmlResponse';
import log from '../../helpers/log';

const source = cspaceAPI({
  url: 'https://pahma.cspace.berkeley.edu/cspace-services',
  username: '',
  password: '',
});

const dest = cspaceAPI({
  url: 'https://pahma-dev.cspace.berkeley.edu/cspace-services',
  username: '',
  password: '',
});

const limit = 1000;

const searchConfig = {
  params: {
    pgSz: limit,
    pgNum: 0,
    as: 'media_common:identificationNumber LIKE "1-99%" AND media_common:blobCsid IS NOT NULL',
    wf_deleted: false,
  },
};

const copyBlobs = async () => {
  const response = await source.read('media', searchConfig);
  const data = await getDataFromXmlResponse(response);

  const items = get(data, ['ns2:abstract-common-list', 'list-item'])
    .map(item => ({
      mediaCsid: get(item, ['csid', 0]),
      blobCsid: get(item, ['blobCsid', 0]),
    }))
    .filter(item => (item.mediaCsid && item.blobCsid));

  for (const item of items) { // eslint-disable-line no-restricted-syntax
    const {
      blobCsid,
      mediaCsid,
    } = item;

    log(`copying blob ${blobCsid}`);

    let newBlobCsid;

    try {
      newBlobCsid = await copyBlob(blobCsid, source, dest);
    } catch (error) {
      log(`error copying blob ${blobCsid}`, error);
    }

    if (newBlobCsid) {
      log(`copied to ${newBlobCsid}`);
      log(`updating media ${mediaCsid}`);

      try {
        await dest.update(`media/${mediaCsid}`, {
          data: `<?xml version="1.0"?>
            <document name="media">
              <ns2:media_common xmlns:ns2="http://collectionspace.org/services/media">
                <blobCsid>${newBlobCsid}</blobCsid>
              </ns2:media_common>
            </document>`,
        });
      } catch (error) {
        log(`error updating media ${mediaCsid}`, error);
      }
    }
  }
};

copyBlobs()
  .then(() => log('done'))
  .catch(error => log('error', error));
