'use strict';

const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Admin } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect(process.env.DATASTORE_URL)
  .then(db => {
    let admin = Admin.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      path: process.env.FILEMAKER_MIGRATION_TOOL,
      server: process.env.FILEMAKER_SERVER
    });
    return admin
      .save()
      .then(admin => admin.api.login())
      .then(response =>console.log(response))
      .then(admin => {
        setTimeout(() => {
          console.log(admin.migration.status());
        }, 13000);

        return admin.migration.execute({
          force: true,
          clone_path: process.env.FILEMAKER_CLONE_DB,
          src_path: process.env.FILEMAKER_SOURCE_DB
        });
      })
      .then(migration => admin.api.logout())
      .then(response => console.log(response));
  })
  .catch(error => console.log(error));
