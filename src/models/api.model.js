'use strict';

const { Document } = require('marpat');

/**
 * @class API
 * @classdesc The class containing methods for interacting with the Admin API
 * 
 */

class API extends Document {
  constructor() {
    super();
    this.schema({});
  }
}
/**
 * @module CLI
 */
module.exports = {
  API
};
