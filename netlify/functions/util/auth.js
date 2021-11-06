const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
const cookie = require("cookie");

const SITE_URL = process.env.URL || 'http://localhost:8888'

/* Auth values */
const TOKEN_HOST = 'https://api.netlify.com'
const TOKEN_URL =  'https://api.netlify.com/oauth/token'
const USER_PROFILE_URL = 'https://api.netlify.com/api/v1/user'
const AUTHORIZATION_URL = 'https://app.netlify.com/authorize'
const REDIRECT_URL = `${SITE_URL}/.netlify/functions/auth-callback`

/* Env key name */
const clientIdKey = 'OAUTH_CLIENT_ID'
const clientSecretKey = 'OAUTH_CLIENT_SECRET'

const config = {
  /* values set in terminal session or in netlify environment variables */
  clientId: process.env[clientIdKey],
  clientSecret: process.env[clientSecretKey],
  /* OAuth API endpoints */
  tokenHost: TOKEN_HOST,
  authorizePath: AUTHORIZATION_URL,
  tokenPath: TOKEN_URL,
  profilePath: USER_PROFILE_URL,
  /* redirect_uri is the callback url after successful signin */
  redirect_uri: REDIRECT_URL,
}

function authInstance(credentials) {
  if (!credentials.client.id) {
    throw new Error(`MISSING REQUIRED ENV VARS. Please set ${clientIdKey}`)
  }
  if (!credentials.client.secret) {
    throw new Error(`MISSING REQUIRED ENV VARS. Please set ${clientSecretKey}`)
  }
  return new AuthorizationCode(credentials)
}

module.exports = {
  /* Export config for functions */
  config: config,
  /* Create oauth2 instance to use in our functions */
  oauth: authInstance({
    client: {
      id: config.clientId,
      secret: config.clientSecret
    },
    auth: {
      tokenHost: config.tokenHost,
      tokenPath: config.tokenPath,
      authorizePath: config.authorizePath
    }
  }),
  tokens: {
    encode: function(token) {
      return Buffer.from(token, "utf8").toString("base64");
    },
    decode: function(token) {
      return Buffer.from(token, "base64").toString("utf8");
    }
  },
  getCookie: function(name, value, expiration) {
    let options = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: '/',
      maxAge: expiration,
    };

    // no strict cookies on localhost for local dev
    if(SITE_URL.startsWith("http://localhost:8888")) {
      delete options.sameSite;
    }

    return cookie.serialize(name, value, options)
  }
}
