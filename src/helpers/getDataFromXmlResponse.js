import xml2js from 'xml2js';

export default (response) => {
  const parser = new xml2js.Parser();

  return new Promise((resolve, reject) => {
    const xml = response.data;

    if (typeof xml === 'string') {
      parser.parseString(xml, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    } else {
      reject(new Error('Data not found in response.'));
    }
  });
};
