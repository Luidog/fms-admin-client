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
  /**
   * preInit is a hook
   * @schema
   * @return {null} The preInit hook does not return anything
   */
  preInit(data) {
    this.cli = CLI.create({ user: data.user, password: data.password });
  }
  /**
   * @method clone
   * @memberof Admin
   * @public
   * @param {String} database The database to backup.
   * @description Performs a backup of the database passed to it then copies this file to a temp
   * directory where the file can be easily streamed to a destination.
   * @see {@method CLI#backup}
   * @return {Object} returns an object with the path to the cloned version of the database
   *
   */
  clone(database) {
    return this._getPaths().then(paths =>
      this.cli
        .backup(database, paths.fmPath)
        .then(response =>
          fse
            .createReadStream(path.join(paths.tempPath, database))
            .pipe(fse.createWriteStream(path.join('./tmp', database)))
        )
        .then(() =>
          Object.assign({
            path: path.join('./tmp', database)
          })
        )
    );
  }
  /**
   * @method list
   * @memberof Admin
   * @public
   * @description returns an array of the currently active items based on the parameter
   * sent to it.
   * @param {String} item the item to list. This can be schedules, files, or clients.
   * @return {Array} items current open or active items
   */
  list(item) {
    return this.cli.list(item);
  }
  /**
   * @method _getPaths
   * @memberof Admin
   * @private
   * @description Gets the working paths for the current server based on a list of files currently
   * host. There is a lot more work to do here yet. The two keys returned are tempPath and fmPath.
   * The fmPath contains the volume and filemac or filewin encodings. the tempPath contains the path
   * for fse to stream the file.
   * @return {Object} paths a filemaker path and a temp path.
   */
  _getPaths() {
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
}

/**
 * @module Admin
 */

module.exports = {
  Admin
};
