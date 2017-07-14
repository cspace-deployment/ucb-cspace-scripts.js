import log from './log';

export default () => {
  const info = {
    url: undefined,
    username: undefined,
    password: undefined,
  };

  Object.keys(info).forEach((key) => {
    const envKey = `CSPACE_${key.toUpperCase()}`;
    const value = process.env[envKey];

    if (!value) {
      log(`The environment variable ${envKey} is not set.`);
    }

    info[key] = value;
  });

  Object.keys(info).forEach((key) => {
    if (!info[key]) {
      log('CollectionSpace connection information is incomplete. Exiting.');

      process.exit(1);
    }
  });

  log('\n\nUsing CollectionSpace connection information:', Object.assign({}, info, {
    password: '[redacted]',
  }));

  return info;
};
