import get from 'lodash/get';

export default (response) => {
  const contentDisposition = get(response, ['headers', 'content-disposition']);

  if (contentDisposition && contentDisposition.match(/filename="(.*?)"/)) {
    return RegExp.$1;
  }

  return null;
};
