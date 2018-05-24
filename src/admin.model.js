'use strict';

const os = require('os');
const path = require('path');
const node_ssh = require('node-ssh');

const { Document } = require('marpat');
const { CLI } = require('./cli.model');

/**
 * @class Admin
 * @classdesc The class used when starting an SSH connection
 */
class Admin extends Document {
  constructor() {
    super();
    this.schema({
      /**
       * An embedded document containing the fmsadmin cli interaction methods.
       * @type {Object}
       */
      cli: {
        type: CLI,
        required: true
      }
    });
  }

  preInit(data) {
    this.cli = CLI.create({ user: data.user, password: data.password });
  }
}

/**
 * @module Admin
 */

module.exports = {
  Admin
};
