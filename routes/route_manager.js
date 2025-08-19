const express = require('express');
const admin = require('./page/admin/index');
const index = require('./page/index');

const app = express();

//!PAGES
app.use('/', index);
app.use('/Admin', admin);

//?API


module.exports = app;