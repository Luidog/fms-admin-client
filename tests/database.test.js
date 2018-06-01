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

describe('list Capabilities', () => {
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

  it('should pause a database', () => {
    return expect(admin.cli.pause('FMServer_Sample.fmp12')).to.eventually.be.an('object');
  });
  it('should resume a database', () => {
    return expect(admin.cli.resume('FMServer_Sample.fmp12')).to.eventually.be.an('object');
  });
  it('should close a database', () => {
    return expect(admin.cli.close('FMServer_Sample.fmp12')).to.eventually.be.an('object');
  });
  it('should open a database', () => {
    return expect(admin.cli.open('FMServer_Sample.fmp12')).to.eventually.be.an('object');
  });
});
