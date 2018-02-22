/* eslint-disable no-console */

import util from 'util';

export default (message, object) => {
  console.log(message);

  if (typeof object !== 'undefined') {
    console.log(util.inspect(object, {
      depth: 6,
      colors: true,
    }));
  }

  return object;
};
