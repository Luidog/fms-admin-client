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

chai.use(chaiAsPromised);

describe('Clone Capabilities', () => {
  let database, admin;

  before(done => {
    environment.config({ path: './tests/.env' });
    varium(process.env, './tests/env.manifest');
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        return done();
      });
  });

  beforeEach(done => {
    admin = Admin.create({
      user: process.env.USERNAME,
      password: process.env.PASSWORD
    });
    done();
  });

  it('should clone a file to a temp directory', () => {
    return expect(admin.clone('tasks.fmp12').catch(error => error))
      .to.eventually.be.an('object')
      .that.has.all.keys('path');
  });
});
