/* global describe before beforeEach it */

/* eslint-disable */

const assert = require('assert');
const { expect, should } = require('chai');

/* eslint-enable */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Admin } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

chai.use(chaiAsPromised);

describe('Admin Client Capabilities', () => {
  let database, admin;

  before(done => {
    connect(process.env.DATASTORE_URL)
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        return done();
      });
  });

  it('should allow the migration tool path to be omitted', () => {
    admin = Admin.create({
      user: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    });
    return expect(admin.save())
      .to.eventually.be.an('object')
      .that.has.all.keys('_schema', '_id', 'cli', 'api', 'migration');
  });
});
