'use strict';

const { EmbeddedDocument } = require('marpat');
/**
 * @class CLI
 * @classdesc The class containing methods for interacting with the fmsadmin
 * CLI.
 */
class CLI extends EmbeddedDocument {
  constructor() {
    super();
    this.schema({
      user: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      }
    });
  }
  run(command) {
    const s = `fmsadmin -u${this.user} -p${this.pass} ${command}`;
    console.log(command);
    return s;
  }
  pause(database) {
    return this.run(`PAUSE ${database}`);
  }
  close(database) {
    return this.run(`CLOSE ${database}`);
  }
  open(database) {
    return this.run(`OPEN ${database}`);
  }
  resume(database) {
    return this.run(`RESUME ${database}`);
  }
  backup(database, destination) {
    return this.run(`backup ${database} -k0 --des ${destination}`);
  }
  clone(database, destination) {
    return this.run(`backup ${database} -k0 --des ${destination}`);
  }
}
/**
 * @module CLI
 */
module.exports = {
  CLI
};
