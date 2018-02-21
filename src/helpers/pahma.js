/* global isNaN, isFinite */

const isNumber = n => (!isNaN(parseFloat(n)) && isFinite(n));

// eslint-disable-next-line max-len
//                                   1    2                 3         4              5       6    7       8     9        10    11       12
export const objectNumberPattern = /^([cC](ons|ONS)?[-. ]?)?([A-Za-z]+(-[A-Za-z]+)?)?([-. ])?(\d+)([-. ])?(\d+)?([-. ]+)?(\d+)?([-. ]+)?(.*)$/;

export const computeSortableObjectNumber = (objectNumber) => {
  const match = objectNumberPattern.exec(objectNumber);

  if (!match) {
    return objectNumber;
  }

  return [match[3], match[6], match[8], match[10], match[12]]
    .filter(token => !!token)
    .map(token => (isNumber(token) ? token.padStart(6, '0') : token))
    .join(' ')
    .trim();
};
