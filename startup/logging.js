const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  /*winston.add(new winston.transports.MongoDB({
    db: 'mongodb+srv://aha_lalonso:Z93hKJ433Ynhn8U@cluster0-yz3je.azure.mongodb.net/vidly?ssl=true&authSource=admin',
    level: 'info'
  }));*/
};
