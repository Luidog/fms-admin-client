'use strict';

const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Admin } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect('nedb://memory').then(db => {
  let client = Admin.create({
    user: process.env.USERNAME,
    password: process.env.PASSWORD
  });

  client
    .save()
    .then(client => client.cli.start('fmdapi'))
    .then(response => console.log(response))
    .catch(error => console.log(error));
});
