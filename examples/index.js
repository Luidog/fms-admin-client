'use strict';

const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Admin } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect('nedb://memory').then(db => {
  let admin = Admin.create({
    user: process.env.USERNAME,
    password: process.env.PASSWORD
  });

  admin.save().then(admin => {
    admin.clone('tasks.fmp12').then(file => console.log(file));

    admin
      .list('files')
      .then(files => console.log(files))
      .catch(error => console.log(error));
  });
});
