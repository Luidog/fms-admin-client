'use strict';

const _ = require('lodash');
const path = require('path');
const fse = require('fs-extra');

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
  clone(database) {
    return this.getPaths().then(paths =>
      this.cli
        .backup(database, paths.fmPath)
        .then(response =>
          fse
            .createReadStream(path.join(paths.tempPath, database))
            .pipe(fse.createWriteStream(path.join('./tmp', database)))
        )
        .then(() => path.join('./tmp', database))
    );
  }

  list(item) {
    return this.cli.list(item);
  }

  getPaths() {
    return this.cli.list('files').then(files => {
      fse.ensureDir('./tmp');
      let pathArray = files[0].split(path.sep);
      let server =
        _.findIndex(pathArray, path => path === 'FileMaker Server') + 1;
      let paths = {
        fmPath: path.join(...pathArray.slice(0, server), 'backup', path.sep),
        tempPath: path.join(
          '/',
          ...pathArray.slice(2, server),
          'backup',
          'Databases'
        )
      };
      return paths;
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
