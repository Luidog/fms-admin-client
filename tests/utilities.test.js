/* global describe it */

const environment = require('dotenv');
const varium = require('varium');

const chai = require('chai');
const { expect } = chai;

const { convertCommands, sanitize } = require('../src/utilities');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

describe('Utilities', function() {
  describe('convertCommands Utility', function() {
    it('should convert a json object into an an array', function() {
      return expect(
        convertCommands({
          force: true,
          clone_path: process.env.FILEMAKER_CLONE_DB,
          src_path: process.env.FILEMAKER_SOURCE_DB
        })
      )
        .to.include('-force', '-clone_path', '-src_path')
        .and.to.have.lengthOf(5);
    });
    it('should drop any object property with a value of false', function() {
      return expect(
        convertCommands({
          force: false,
          clone_path: process.env.FILEMAKER_CLONE_DB,
          src_path: process.env.FILEMAKER_SOURCE_DB
        })
      )
        .to.have.lengthOf(4)
        .and.to.not.include('-force');
    });
  });
  describe('sanitize Utility', function() {
    it('should allow safe parameters', function() {
      return expect(
        sanitize(
          {
            force: false,
            clone_path: process.env.FILEMAKER_CLONE_DB,
            src_path: process.env.FILEMAKER_SOURCE_DB
          },
          ['force', 'clone_path', 'src_path']
        )
      )
        .to.be.an('object')
        .to.have.all.keys('force', 'clone_path', 'src_path');
    });
    it('should remove unsafe parameters', function() {
      return expect(
        sanitize(
          {
            force: false,
            broccoli: 'yuk',
            clone_path: process.env.FILEMAKER_CLONE_DB,
            src_path: process.env.FILEMAKER_SOURCE_DB
          },
          ['force', 'clone_path', 'src_path']
        )
      )
        .to.be.an('object')
        .to.have.all.keys('force', 'clone_path', 'src_path');
    });
  });
});
