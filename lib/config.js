module.exports = () => {
  const env = process.env.NODE_ENV || 'local';
  console.log('info: environment -> ', env);
  let config = require('./../env/' + env);
  config.environment = env;
  return config;
}