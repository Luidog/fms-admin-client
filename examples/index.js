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
    privateKey: process.env.PRIVATEKEY,
    user: process.env.USER,
    password: process.env.PASSWORD
  });

  client.save().then(client =>
    client
      .connect()
      .then(ssh => {
        ssh
          .exec(client.cli.pause(process.env.APPLICATION), [''], {
            stream: 'stdout',
            options: { pty: true }
          })
          .then(response => console.log(response))
          .then(() => client.disconnect());
      })

      .catch(error => console.log(error))
  );
});
