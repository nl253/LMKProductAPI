const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/products', require('./routes/products'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500)
     .set('content-type', 'text/plain')
     .send(err.message || 'Something broke!');
});

module.exports = app;
