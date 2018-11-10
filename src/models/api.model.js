'use strict';

const { Document } = require('marpat');
const { Connection } = require('./connection.model');
const axios = require('axios');

/**
 * @class API
 * @classdesc The class containing methods for interacting with the Admin API
 *
 */

class API extends Document {
  constructor() {
    super();
    this.schema({
      /**
       * The version of Admin API to use.
       * @member API#version
       * @type String
       */
      version: {
        type: String,
        required: true,
        default: '1'
      },
      /**
       * The API Connection.
       * @member API#connection
       * @type String
       */
      connection: {
        type: Connection,
        required: true
      },
      /**
       * The FileMaker server.
       * @member API#server
       * @type String
       */
      server: {
        type: String,
        validate: data =>
          data.startsWith('http://') || data.startsWith('https://'),
        required: true
      }
    });
  }

  preInit(data) {
    this.connection = Connection.create(data);
  }
  /**
   * @method _authURL
   * @memberof Client
   * @private
   * @description Generates a url for use when retrieving authentication tokens
   * in exchange for Account credentials.
   * @return {String} A URL to use when authenticating a FileMaker DAPI session.
   */
  _loginURL() {
    let url = `${this.server}/fmi/admin/api/v1/user/login`;
    return url;
  }

  /**
   * @method _logoutURL
   * @memberof Client
   * @private
   * @description Generates a url for use when logging out of a FileMaker Session.
   * @return {String} A URL to use when logging out of a FileMaker DAPI session.
   */
  _logoutURL(token) {
    let url = `${this.server}/fmi/admin/api/v1/user/logout`;
    return url;
  }

  /**
   * @method login
   * @memberof Client
   * @public
   * @description creates a session with the Data API and returns a token.
   * @see {@method Client#authenticate}
   * @return {Promise} returns a promise that will either resolve or reject based on the Data API.
   *
   */

  login() {
    return this.authenticate().then(token => ({
      token
    }));
  }

  /**
   * @method logout
   * @memberof Client
   * @public
   * @description logs out of the current authentication session and clears the saved token.
   * @see {@method Connnection#clear}
   * @return {Promise} returns a promise that will either resolve or reject based on the Data API.
   *
   */

  logout() {
    return new Promise(
      (resolve, reject) =>
        this.connection.valid()
          ? this.agent
              .request({
                url: this._logoutURL(),
                method: 'post',
                headers: {
                  authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                data: {}
              })
              .then(response => response.data)
              .then(body => this.data.outgoing(body))
              .then(body => this.connection.clear(body))
              .then(body => this._saveState(body))
              .then(body => resolve(body.messages[0]))
              .catch(error => reject(this._checkToken(error)))
          : reject({ message: 'No session to log out.' })
    );
  }

  /**
   * @method authenticate
   * @memberof Client
   * @private
   * @description Checks the private connection schema for a token and if the current time is between when that token was
   * issued and when it will expire. If the connection token is not a string (its empty) or the current time is
   * not between when the token is issued and the time it will expire this method calls the private
   * is returned this promise method will reject.
   * @see {@method Connnection#generate}
   * @return {Promise} returns a promise that will either resolve or reject based on the Data API.
   *
   */
  authenticate() {
    return new Promise((resolve, reject) => {
      if (this.connection.valid()) {
        resolve(this.connection.token);
      } else {
        this.connection
          .generate(axios, this._loginURL())
          .then(body => this._saveState(body))
          .then(body => resolve(body.token))
          .catch(error => reject(error));
      }
    });
  }
  /**
   * @method _checkToken
   * @private
   * @description The _checkToken method will check the error based to it
   * for an expired property and if found will delete that property, clear
   * the current token and save the client. This method is used to discard
   * tokens which have been invalidated before their 15 minute expiration
   * lifespan is exceed.
   * @param {Object} error The layout to use when acessing a record.
   * @return {Object} The error object with the expired key removed
   */

  _checkToken(error) {
    if (error.expired) {
      delete error.expired;
      this.connection.clear();
      this.save();
    }
    return error;
  }

  /**
   * @method saveState
   * @private
   * @memberof Client
   * @description Triggers a save and returns the response. This is responsible for ensuring the documents are up to date.
   * @param {Any} response The response data from the data api request.
   * @return {Any} Returns the umodified response.
   *
   */

  _saveState(response) {
    this.save();
    return response;
  }
}
/**
 * @module CLI
 */
module.exports = {
  API
};
