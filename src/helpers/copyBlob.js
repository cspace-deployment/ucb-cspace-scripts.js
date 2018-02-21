import FormData from 'form-data';
import get from 'lodash/get';
import getContentDispositionFilename from './getContentDispositionFilename';

export default (csid, source, dest) =>
  source.read(`blobs/${csid}/content`, { responseType: 'stream' })
    .then((response) => {
      const form = new FormData();

      form.append('file', response.data, {
        filename: getContentDispositionFilename(response),
      });

      return dest.create('blobs', {
        contentType: form.getHeaders()['content-type'],
        data: form,
      });
    })
    .then((response) => {
      const location = get(response, ['headers', 'location']);

      return (location ? location.substring(location.lastIndexOf('/') + 1) : null);
    });
