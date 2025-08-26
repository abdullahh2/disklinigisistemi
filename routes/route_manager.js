const express = require('express');
const admin = require('./page/admin/index');
const index = require('./page/index');
const mw_auth = require('../middlewares/authmw');
const c_route = require('../controller/admin/route_controller');
const c_admin = require('../controller/admin/admin_proccs');
const app = express();

//!PAGES
app.use('/', index);
app.get('/Admin/Login', c_route.login);
app.post('/Admin/Login', c_admin.login);
app.use(mw_auth);
app.use('/Admin', admin);

module.exports = app;