process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection ${err}` );
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
global.config = require('./lib/config')();
global.mongoose = require('./lib/mongo_connect').connect();
const routes = require('./routes/routes');
require('./models/users');
require('./models/wars');


class Index {
  constructor() {
    this.configure();
  }

  configure() {
    app.use(express.json())
    app.use(routes());
  }
  
  start() {
    app.listen(config.port, () => console.log(`server started on ${config.port}`))
  }
}

const index = new Index();
index.start();