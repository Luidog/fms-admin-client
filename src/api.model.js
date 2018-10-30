'use strict';

const { EmbeddedDocument } = require('marpat');

/**
 * @class CLI
 * @classdesc The class containing methods for interacting with the fmsadmin
 * CLI.
 */

class API extends EmbeddedDocument {
  constructor() {
    super();
    this.schema({
    });
  }
}
/**
 * @module CLI
 */
module.exports = {
  API
};
