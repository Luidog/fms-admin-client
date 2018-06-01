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

  it('should return an array from a list file request', () => {
    return expect(admin.list('files')).to.eventually.be.an('array');
  });
  it('should return an array from a list schedule request', () => {
    return expect(admin.list('schedules')).to.eventually.be.an('array');
  });
  it('should return an array from a list client request', () => {
    return expect(admin.list('clients')).to.eventually.be.an('array');
  });
  it('should reject if it can not list the request', () => {
    return expect(
      admin.list('burritos').catch(error => error)
    ).to.eventually.be.an('object');
  });
});
