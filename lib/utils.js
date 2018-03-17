const util = require('util');

function wait(func, context, ...args) {
  if (func && typeof (func.then) === 'function') {
    return func.apply(context, args).then(data => {
      return [null, data];
    })
      .catch(err => [err]);
  } else if (typeof (func) === 'function') {
    func = util.promisify(func);
    return func.apply(context, args).then(data => {
      return [null, data];
    })
      .catch(err => [err]);
  } else {
    throw Error('only function and promise is allowed to apply on wait');
  }
}

  module.exports = {
      wait
  }