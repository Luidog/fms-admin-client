'use strict';

const { Document } = require('marpat');
const { spawn, exec } = require('child_process');
const _ = require('lodash');
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
    this.session = [];
    let commandArray = _.flatten(
      _.compact(
        _.values(
          _.mapValues(commands, (value, key, object) => {
            if (value === true) {
              return [`-${key}`];
            } else if (value !== false) {
              return [`-${key}`, value];
            }
            return;
          })
        )
      )
    );
    let thisProcess = spawn(this.path, commandArray);

    thisProcess.stdout.on('data', data => this.log(data));
    thisProcess.stderr.on('error', error => this.log(error));
    thisProcess.on('close', () => this.end());
    this.process = thisProcess.pid;

    return this.save();
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
    process.kill(this.process);
  }
}
/**
 * @module Credentials
 */
module.exports = {
  Migration
};
