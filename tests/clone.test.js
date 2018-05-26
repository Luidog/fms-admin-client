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

describe('Service Capabilities', () => {
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

  it('should throw an error if the service is already running', () => {
    return expect(admin.cli.clone('fmdapi').catch(error => error))
      .to.eventually.be.an('object')
      .that.has.all.keys('code', 'message');
  });

  it('should stop the service', () => {
    return expect(admin.cli.stop('fmdapi'))
      .to.eventually.be.an('object')
      .that.has.all.keys('message');
  });

  it('should throw an error if the service is not running', () => {
    return expect(admin.cli.stop('fmdapi'))
      .to.eventually.be.an('object')
      .that.has.all.keys('code', 'message');
  });

  it('should start the service', () => {
    return expect(admin.cli.start('fmdapi'))
      .to.eventually.be.an('object')
      .that.has.all.keys('message');
  });
});
