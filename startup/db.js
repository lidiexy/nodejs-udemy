const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  keepAlive: 1,
  reconnectTries: Number.MAX_VALUE
};

module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db, mongoOptions)
    .then(() => winston.info('Connected to MongoDB...'));
};
