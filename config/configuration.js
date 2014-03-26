/**
 * @file Defines the provider settings.
 *
 * Will set the path to Mongo, and applications id
 * Most of the configuration can be done using system environment variables.
 */

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";

// Port to run the app on. 8000 for development
// (Vagrant syncs this port)
// 80 for production
var default_port = 8000;
if(node_env === "production") {
  default_port = 80;
}

if(!process.env.DROPBOX_CONNECT_URL) {
  console.log("Connect url not specified, oAuth will not work.");
}

// Exports configuration for use by app.js
module.exports = {
  env: node_env,
  port: process.env.PORT || default_port,
  mongo_url: process.env.MONGO_URL || ("mongodb://localhost/provider-dropbox-" + node_env),

  dropbox_id: process.env.DROPBOX_ID,
  dropbox_secret: process.env.DROPBOX_SECRET,
  dropbox_callback: process.env.DROPBOX_CALLBACK_URL,
  dropbox_connect: process.env.DROPBOX_CONNECT_URL,
  dropbox_image: process.env.DROPBOX_IMAGE_URL,

  anyfetch_id: process.env.DROPBOX_ANYFETCH_ID,
  anyfetch_secret: process.env.DROPBOX_ANYFETCH_SECRET,

  max_concurrency: process.env.DROPBOX_MAX_CONCURRENCY || 5,
  workers: process.env.WORKERS || 2,

  test_tokens: {
    oauth_token_secret: process.env.DROPBOX_TEST_OAUTH_TOKEN_SECRET,
    oauth_token: process.env.DROPBOX_TEST_OAUTH_TOKEN,
    uid: process.env.DROPBOX_TEST_UID,
  },
  test_image_path: process.env.DROPBOX_TEST_IMAGE_PATH, // Path to an image in the dropbox test account
  test_cursor: process.env.DROPBOX_TEST_CURSOR
};
