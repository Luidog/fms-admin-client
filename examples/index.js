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
      user: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      path: process.env.FILEMAKER_MIGRATION_TOOL
    });

    return admin
      .save()
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
      .then(migration => console.log(migration));
  })
  .catch(error => console.log('error', error));
