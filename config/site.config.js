const path = require('path');
const fs = require('fs');

let ROOT = process.env.PWD;

if (!ROOT) {
  ROOT = process.cwd();
}

const API = {
  development: {
    contract: 'https://contract.senioradom.com/api/1',
    actimetry: 'https://gateway.senioradom.com/3',
  },
  production: {
    contract: 'https://contract.senioradom.com/api/1',
    actimetry: 'https://gateway.senioradom.com/3',
  },
};

const config = () => ({
  api: API[process.env.NODE_ENV],

  dev_host: '127.0.0.1', // ['127.0.0.1', 'localhost', '0.0.0.0', '192.168.0.10', '...']

  port: process.env.PORT || 9001,

  env: process.env.NODE_ENV,

  root: ROOT,

  paths: {
    config: 'config',
    src: 'src',
    dist: 'dist',
  },

  package: JSON.parse(
    fs.readFileSync(path.join(ROOT, '/package.json'), { encoding: 'utf-8' }),
  ),
});

module.exports = config();
