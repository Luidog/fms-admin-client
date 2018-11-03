/* global describe before afterEach beforeEach it */

const environment = require('dotenv');
const varium = require('varium');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { connect } = require('marpat');
const { expect } = chai;

chai.use(chaiAsPromised);

const { Admin } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

describe('Migration Capabilities', function() {
  let database, admin;

  before(done => {
    connect(process.env.DATASTORE_URL).then(db => {
      database = db;
      done();
    });
  });

  beforeEach(function(done) {
    admin = Admin.create({
      user: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      path: process.env.FILEMAKER_MIGRATION_TOOL
    });
    admin.save().then(admin => done());
  });

  afterEach(function(done) {
    admin.migration.process ? process.kill(admin.migration.process) : null;
    database.dropDatabase().then(() => done());
  });

  it('should start a migration process', function() {
    return expect(
      admin.migration.execute({
        force: true,
        clone_path: process.env.FILEMAKER_CLONE_DB,
        src_path: process.env.FILEMAKER_SOURCE_DB
      })
    )
      .to.eventually.be.an('object')
      .that.has.all.keys('_id', 'path', 'process', 'session')
      .and.property('process')
      .to.be.a('number');
  });
  it('should log the migration process', function(done) {
    setTimeout(() => {
      expect(admin.migration.status()).to.be.an('array').that.is.not.empty;
      expect(admin.migration.process).to.be.a('number');
      done();
    }, 3000);
    admin.migration.execute({
      force: true,
      clone_path: process.env.FILEMAKER_CLONE_DB,
      src_path: process.env.FILEMAKER_SOURCE_DB
    });
  });
  it('should stop the migration process', function() {
    return expect(
      admin.migration
        .execute({
          force: true,
          clone_path: process.env.FILEMAKER_CLONE_DB,
          src_path: process.env.FILEMAKER_SOURCE_DB
        })
        .then(migration => admin.migration.stop())
    )
      .to.eventually.be.an('object')
      .that.has.all.keys('message', 'process');
  });
  it('should reject if there is no process to stop', function() {
    return expect(admin.migration.stop().catch(error => error))
      .to.eventually.be.an('object')
      .that.has.all.keys('message');
  });
  it('should log process errors', function(done) {
    setTimeout(() => {
      expect(admin.migration.status()).to.be.an('array').that.is.not.empty;
      expect(admin.migration.process).to.be.undefined;
      done();
    }, 5000);
    admin.migration.path = 'none';
    admin.migration.execute({
      force: true,
      clone_path: process.env.FILEMAKER_LOCALIZED_DB,
      src_path: process.env.FILEMAKER_SOURCE_DB
    });
  });
});
