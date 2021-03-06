'use strict';
/**
 * @file Retrieve files from the account
 */
var dbox = require("dbox");
var TokenError = require('anyfetch-provider').TokenError;

var config = require('../../config/configuration.js');

var getApp = function(oauthToken) {
  var app = dbox.app({
    "app_key": config.dropboxId,
    "app_secret": config.dropboxSecret
  });

  return app.client(oauthToken);
};


/**
 * Retrieve all files associated with this user account,
 *
 * @param {Object} oauthToken Access_token to identify the account
 * @param {String} cursor Last cursor
 * @param {Function} cb Callback. First parameter is the error (if any), then the files metadata, then the new cursor.
 */
module.exports.delta = function(oauthToken, cursor, cb) {
  var client = getApp(oauthToken);
  var options = {};

  if(cursor) {
    options.cursor = cursor;
  }

  client.delta(options, function(status, reply) {
    if(status !== 200) {
      if(status === 401 || status === 403) {
        return cb(new TokenError());
      }
      return cb(reply);
    }

    // Filter for directories, while keeping removed files
    var entries = reply.entries.filter(function(entry) {
      if(!entry[1]) {
        // Keep deleted files
        return true;
      }

      if(entry[1].is_dir) {
        // Don't keep directory names / empty folders
        return false;
      }

      if(entry[1].bytes > config.maxSize * 1024 * 1024) {
        // Only keep files under config.maxSize Mb.
        return false;
      }

      return true;
    });

    // Send files
    cb(null, entries, reply.cursor);
  });
};

/**
* Retrieve a single file data,
*
* @param {Object} dropboxTokens Access tokens to identify the account
* @param {String} path File path
*/
module.exports.getFile = function(dropboxTokens, path, cache, cb) {
  var client = null;

  if(cache.has(dropboxTokens.uid)) {
    client = cache.get(dropboxTokens.uid);
  }
  else {
    client = getApp(dropboxTokens);
    cache.set(dropboxTokens.uid, client);
  }

  var options = {
    root: "dropbox"
  };

  return client.get(path, options, cb);
};
