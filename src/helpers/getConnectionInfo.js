import netrc from 'netrc';
import yargs from 'yargs';
import log from './log';

const getArgName = (connName, property) => (
  [connName && connName.toLowerCase(), property.toLowerCase()]
    .filter(part => !!part)
    .join('-')
);

const getEnvName = (connName, property) => (
  ['CSPACE', connName && connName.toUpperCase(), property.toUpperCase()]
    .filter(part => !!part)
    .join('_')
);

const getPropertyValue = (connName, property) => {
  const argName = getArgName(connName, property);

  if (argName in yargs.argv) {
    return yargs.argv[argName];
  }

  const envName = getEnvName(connName, property);

  if (envName in process.env) {
    return process.env[envName];
  }

  return undefined;
};

export default (connName) => {
  const properties = ['url', 'username', 'password'];
  const info = {};

  properties.forEach((property) => {
    const value = getPropertyValue(connName, property);

    if (typeof value !== 'undefined') {
      info[property] = value;
    }
  });

  if (('url' in info) && (!('username' in info) || !('password' in info))) {
    const net = netrc(yargs.argv.netrc);

    const netMachine = net[info.url];

    if (netMachine) {
      if (!('username' in info) && ('login' in netMachine)) {
        info.username = netMachine.login;
      }

      if (!('password' in info) && ('password' in netMachine)) {
        info.password = netMachine.password;
      }
    }
  }

  const connNameSpace = connName ? `${connName} ` : '';

  if (properties.find(property => !(property in info))) {
    log(`ERROR: Incomplete ${connNameSpace}connection information:`, info);

    process.exit(1);
  }

  log(`Using ${connNameSpace}connection information:`, Object.assign({}, info, {
    password: '••••••',
  }));

  return info;
};
