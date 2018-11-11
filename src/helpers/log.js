/* eslint-disable no-console */

import formatObject from './formatObject';

export default (message, object) => {
  console.error(message);

  if (typeof object !== 'undefined') {
    console.error(formatObject(object));
  }

  return object;
};
