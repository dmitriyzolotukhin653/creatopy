// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  development: {
    storage: path.join(__dirname, '..', 'data/test.sqlite'),
    dialect: 'sqlite',
    logging: true,
    operatorsAliases: false,
  },
};
