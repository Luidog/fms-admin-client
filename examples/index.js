'use strict';

const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Client } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect('nedb://memory').then(db => {
  let client = Client.create({
    host: process.env.HOST,
    username: process.env.USERNAME,
    privateKey: process.env.PRIVATEKEY
  });

  client.save().then(client =>
    client
      .connect()
      .then(ssh => {
        ssh
          .exec('fmsadmin', [''], {
            stream: 'stdout',
            options: { pty: true }
          })
          .then(response => console.log(response))
          .then(() => client.disconnect());
      })

      .catch(error => console.log(error))
  );
});
