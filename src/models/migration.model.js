'use strict';

const { Document } = require('marpat');
const { spawn } = require('child_process');
const { convertCommands, sanitize } = require('../utilities');
const { migration } = require('../constants');

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
        default: 'none',
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
    const newProcess = spawn(
      this.path,
      convertCommands(sanitize(commands, migration.commands))
    );
    this.attach(newProcess);
    return this.save().then(migration => migration.toJSON());
  }

  status() {
    return this.session;
  }

  attach(newProcess) {
    this.session = [];
    this.process = newProcess.pid;
    newProcess.on('error', error => this.log(error));
    newProcess.stdout.on('data', data => this.log(data));
    newProcess.on('exit', () => this.end());
  }

  log(data) {
    this.session.push(data.toString());
    return this.save();
  }

  end() {
    this.process = undefined;
    return this.save();
  }

  stop() {
    return new Promise((resolve, reject) => {
      try {
        process.kill(this.process);
      } catch (error) {
        reject({ message: error.message });
      }
      resolve({ process: this.process, message: 'process stopped' });
    });
  }
}
/**
 * @module Credentials
 */
module.exports = {
  Migration
};
