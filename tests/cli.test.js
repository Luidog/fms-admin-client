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

describe('CLI Capabilities', () => {
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
      user: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    });
    admin.save().then(admin => done());
  });

  it('should throw an error if the service is already running', () => {
    return expect(admin.cli.start('fmdapi').catch(error => error))
      .to.eventually.be.an('object')
      .that.has.all.keys('code', 'message');
  });

  it('should stop the service', () => {
    return expect(admin.cli.stop('fmdapi'))
      .to.eventually.be.an('object')
      .that.has.all.keys('message');
  });

  it('should throw an error if the service is not running', () => {
    return expect(
      admin.cli
        .stop('fmdapi')
        .then(response => admin.cli.stop('fmdapi'))
        .catch(error => error)
    )
      .to.eventually.be.an('object')
      .that.has.all.keys('message');
  });

  it('should pause a database', () => {
    return expect(admin.cli.pause('FMServer_Sample.fmp12')).to.eventually.be.an(
      'object'
    );
  });
  it('should resume a database', () => {
    return expect(
      admin.cli.resume('FMServer_Sample.fmp12')
    ).to.eventually.be.an('object');
  });
  it('should close a database', () => {
    return expect(admin.cli.close('FMServer_Sample.fmp12')).to.eventually.be.an(
      'object'
    );
  });
  it('should open a database', () => {
    return expect(admin.cli.open('FMServer_Sample.fmp12')).to.eventually.be.an(
      'object'
    );
  });

});
