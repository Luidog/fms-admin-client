'use strict';

const _ = require('lodash');

const sanitize = (object, parameters) => _.pick(object, parameters);

const convertCommands = object =>
  _.flatten(
    _.compact(
      _.values(
        _.mapValues(object, (value, key, object) => {
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

module.exports = { sanitize, convertCommands };
