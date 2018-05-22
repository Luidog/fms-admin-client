'use strict';

const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Client } = require('../index.js');
const { expect, should } = require('chai');

chai.use(chaiAsPromised);

describe('Filemaker Admin CLI SSH Client', () => {
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
    client = Client.create({
      host: process.env.HOST,
      username: process.env.USERNAME,
      privateKey: process.env.PRIVATEKEY
    });
    done();
  });

  it('should allow an instance to be saved.', () => {
    return expect(client.save())
      .to.eventually.be.an('object')
      .that.has.all.keys(
        '_schema',
        '_id',
        'cli',
        'privateKey',
        'username',
        'host'
      );
  });

  it('should connect to remote machines', () => {
    return expect(
      client
        .save()
        .then(client => client.connect())
        .then(ssh =>
          ssh.exec('pwd', [''], {
            stream: 'stdout',
            options: { pty: true }
          })
        )
    ).to.eventually.be.an('string');
  });

  it('should disconnect from remote machines', () => {
    return expect(
      client
        .save()
        .then(client => client.connect())
        .then(ssh => client.disconnect())
    ).to.eventually.be.an('undefined');
  });
});
