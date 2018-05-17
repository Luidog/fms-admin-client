'use strict';

const node_ssh = require('node-ssh');
const os = require('os');
const path = require('path');

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
       * The host to connect to.
       * @member Client#host
       * @required
       * @type String
       */
      host: {
        type: String,
        required: true
      },
      /**
       * The username to use when attempting to connect.
       * @member Client#username
       * @required
       * @type String
       */
      username: {
        type: String,
        required: true
      },
      /**
       * The name of the private key to use when attempting to connect. We currently assume the key
       * will be in an .ssh folder in your os's home directory.
       * @member Client#privateKey
       * @required
       * @type String
       */
      privateKey: {
        type: String,
        required: true
      }
    });
  }

  preInit(data) {
    this.privateKey = path.join(os.homedir(), '.ssh', data.privateKey);
  }
  /**
   * @method connection
   * @public
   * @description connection holds the ssh connection. This is done to allow a factory like functionality to reduce
   * the amount of new instances when using this class.
   * @return {Boolean} a boolean of false until overwritten by the connect function.
   */
  connection() {
    return false;
  }
  /**
   * @method connect
   * @public
   * @description a method that will connect to the remote machine.
   * @return {Promise} A promise which will resolve to a ssh connection or reject with an error.
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (!this.connection()) {
        this.connection = new node_ssh();
        resolve(
          this.connection.connect(this.toJSON()).then(() => this.connection)
        );
      } else {
        resolve(this.connection());
      }
    });
  }
  /**
   * @method disconnect
   * @public
   * @description This method will disconnect the current connection
   * @return {Void} This method does not return anything
   */
  disconnect() {
    this.connection.dispose();
  }
}

/**
 * @module Client
 */

module.exports = {
  Client
};
