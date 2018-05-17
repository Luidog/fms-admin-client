'use strict';

const { Document } = require('marpat');

/**
 * @class Client
 * @classdesc The class used when starting an SSH connection
 */
class Client extends Document {
  constructor() {
    super();
    this.schema({
      /**
       * The server to connec
       * @member Client#version
       * @type String
       */
      server: {
        type: String,
        required: true
      }
    });
  }
}

/**
 * @module Client
 */

module.exports = {
  Client
};
