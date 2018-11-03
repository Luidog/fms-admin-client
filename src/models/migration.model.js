'use strict';

const { Document } = require('marpat');
const { spawn } = require('child_process');
const { convertCommands } = require('../utilities');

/**
 * @class Credentials
 * @classdesc The class used to authenticate with into the FileMaker API.
 */
class Migration extends Document {
  constructor() {
    super();
    this.schema({
      /** A string containing the time the token token was issued.
       * @member Credentials#password
       * @type String
       */
      path: {
        type: String,
        required: true
      },
      session: {
        type: Array,
        default: []
      },
      process: {
        type: Number
      }
    });
  }

  execute(commands) {
    let newProcess = spawn(this.path, convertCommands(commands));
    this._attach(newProcess);
    return this.save();
  }

  _attach(newProcess) {
    this.session = [];
    this.process = newProcess.pid;
    newProcess.on('error', error => this._log(error));
    newProcess.stdout.on('data', data => this._log(data));
    newProcess.stderr.on('error', error => this._log(error));
    newProcess.on('close', () => this._end());
  }

  _log(data) {
    this.session.push(data.toString());
    return this.save();
  }

  _end() {
    this.process = undefined;
    return this.save();
  }

  stop() {
    process.kill(this.process);
  }
}
/**
 * @module Credentials
 */
module.exports = {
  Migration
};
