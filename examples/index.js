'use strict';

const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Client } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect('nedb://memory').then(db => {
  let client = Client.create({
    server: process.env.SERVER
  });

  client.save().then(client => console.log(client.toJSON()));
});
