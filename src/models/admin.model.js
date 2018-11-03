'use strict';

const { Document } = require('marpat');
const { CLI } = require('./cli.model');
const { Migration } = require('./migration.model');
const { API } = require('./api.model');
/**

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
      },
      api:{
        type: API,
        required: true
      },
      migration: {
        type: Migration,
        required: true
      }
    });
  }
  /**
   * preInit is a hook
   * @schema
   * @return {null} The preInit hook does not return anything
   */
  preInit(data) {
    this.cli = CLI.create({ user: data.user, password: data.password });
    this.migration = Migration.create({ path: data.path });
    this.api = API.create({});
  }

  preSave() {
    return this.migration.save();
  }
}

/**
 * @module Admin
 */

module.exports = {
  Admin
};
