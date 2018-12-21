const commonConfig = {
  isProduction: false,
  apiPath: 'http://159.89.197.13',
  baseURL: 'http://159.89.197.13',
  port: 80,
};

const environmentConfig = {
  development: {},
  staging: {
    isProduction: true,
    port: 80,
    baseURL: 'http://159.89.197.13',
    apiPath: 'http://159.89.197.13',
  },
  production: {
    isProduction: true,
    baseURL: 'http://159.89.197.13',
    apiPath: 'http://159.89.197.13',
    port: 80,
  }
};

module.exports = Object.assign(
  commonConfig,
  environmentConfig[process.env.ENV || process.env.NODE_ENV || 'development']
);