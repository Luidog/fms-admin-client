'use strict';

const { EmbeddedDocument } = require('marpat');
const fse = require('fs-extra');
const { spawn, exec } = require('child-process-promise');
const stringStream = require('string-to-stream');
const { Credentials } = require('./credentials.model');

/**
 * @class CLI
 * @classdesc The class containing methods for interacting with the fmsadmin
 * CLI.
 */

class CLI extends EmbeddedDocument {
  constructor() {
    super();
    this.schema({
      credentials: {
        type: Credentials,
        required: true
      }
    });
  }
  preInit(data) {
    this.credentials = Credentials.create({
      user: data.user,
      password: data.password
    });
  }

  run(command) {
    return exec(
      `fmsadmin -u ${this.credentials.user} -p ${
        this.credentials.password
      } ${command}`
    );
  }

  pause(database) {
    return this.run(`PAUSE ${database}`);
  }

  close(database) {
    return this.run(`-yf CLOSE ${database} `);
  }

  open(database) {
    return this.run(`OPEN ${database}`);
  }

  resume(database) {
    return this.run(`RESUME ${database}`);
  }

  backup(database, destination) {
    return fse
      .ensureDir(destination)
      .then(() => this.run(`BACKUP ${database} -k0 --dest "${destination}"`));
  }

  start(service) {
    return new Promise((resolve, reject) => {
      let spawnedProcess, child;
      spawnedProcess = spawn(
        'fmsadmin',
        [
          '-u',
          this.credentials.user,
          '-p',
          this.credentials.password,
          'start',
          service
        ],
        {
          capture: ['stdout', 'stderr']
        }
      );

      child = spawnedProcess.childProcess;

      child.stdout.on(
        'data',
        data =>
          data.toString().includes('Error:')
            ? reject(this._errorMap(data))
            : stringStream('y').pipe(child.stdin)
      );
      child.stderr.on('data', data => reject(this._errorMap(data)));

      spawnedProcess
        .then(response => resolve({ message: response.stdout }))
        .catch(error => reject(this._errorMap(error)));
    });
  }

  list(item) {
    return this.run(`list ${item}`)
      .then(response => {
        typeof response.stdout;
        return response.stdout === '' ? [] : response.stdout.split('\n');
      })
      .catch(error => Object.assign({ message: error.stdout }));
  }

  stop(service) {
    return new Promise((resolve, reject) => {
      let spawnedProcess, child;
      spawnedProcess = spawn(
        'fmsadmin',
        [
          '-u',
          this.credentials.user,
          '-p',
          this.credentials.password,
          'stop',
          service
        ],
        {
          capture: ['stdout', 'stderr']
        }
      );

      child = spawnedProcess.childProcess;

      child.stdout.on(
        'data',
        data =>
          data.toString().includes('Error:')
            ? reject(this._errorMap(data))
            : stringStream('y').pipe(child.stdin)
      );
      child.stderr.on('data', data => reject(this._errorMap(data)));

      spawnedProcess
        .then(response => resolve({ message: response.stdout }))
        .catch(error => reject(this._errorMap(error)));
    });
  }

  _errorMap(error) {
    let mappedError = {
      code: error.toString().match(/\d+/g)[0],
      message: error
        .toString()
        .split('(')
        .pop()
        .split(')')
        .shift()
    };
    return mappedError;
  }
}
/**
 * @module CLI
 */
module.exports = {
  CLI
};
