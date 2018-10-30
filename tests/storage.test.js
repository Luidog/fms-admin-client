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

describe('Storage Capabilities', () => {
  let database, client;

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
    client = Admin.create({
      user: process.env.USERNAME,
      password: process.env.PASSWORD
    });
    done();
  });

  it('should allow an instance to be created', () => {
    return expect(Promise.resolve(client))
      .to.eventually.be.an('object')
      .that.has.all.keys('_schema', 'cli', '_id');
  });

  it('should allow an instance to be saved.', () => {
    return expect(client.save())
      .to.eventually.be.an('object')
      .that.has.all.keys('_schema', '_id', 'cli');
  });

  it('should allow an instance to be recalled', () => {
    return expect(Admin.findOne({}))
      .to.eventually.be.an('object')
      .that.has.all.keys('_schema', '_id', 'cli');
  });

  it('should allow insances to be listed', () => {
    return expect(Admin.find({})).to.eventually.be.an('array');
  });

  it('should allow you to remove an instance', () => {
    return expect(Admin.deleteOne({}))
      .to.eventually.be.an('number')
      .and.equal(1);
  });
});
