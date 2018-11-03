'use strict';

const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Admin } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect('nedb://memory')
  .then(db => {
    let admin = Admin.create({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      path: process.env.MIGRATION_TOOL_PATH
    });

    return admin.save().then(admin => {
      admin.migration
        .execute({
          force: true,
          clone_path: './migration/Test-DB-Clone.fmp12',
          src_path: './migration/Test-DB-Prod.fmp12'
        })
        .then(migration => console.log(migration))
        .catch(error => {
          console.log('ERROR',error);
        });
      return admin;
    });
  })
  .then(admin => {
    setTimeout(function() {
      Admin.find().then(admins => console.log(admins[0].toJSON()));
    }, 1000);
    setTimeout(function() {
      Admin.find().then(admins => console.log(admins[0].toJSON()));
    }, 10000);
  })
  .catch(error => console.log('error', error));
