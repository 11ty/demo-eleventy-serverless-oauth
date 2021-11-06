const { AuthorizationCode } = require('simple-oauth2');
const cookie = require("cookie");
const fetch = require('node-fetch')

const SITE_URL = process.env.URL || 'http://localhost:8888'

const netlifyConfig = {
  clientIdKey: "NETLIFY_OAUTH_CLIENT_ID",
  clientSecretKey: "NETLIFY_OAUTH_CLIENT_SECRET",

  /* OAuth API endpoints */
  tokenHost: 'https://api.netlify.com',
  tokenPath: 'https://api.netlify.com/oauth/token',
  authorizePath: 'https://app.netlify.com/authorize',

  /* User API endpoint */
  userApi: "https://api.netlify.com/api/v1/user/",
};

// https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
const githubConfig = {
  clientIdKey: "GITHUB_OAUTH_CLIENT_ID",
  clientSecretKey: "GITHUB_OAUTH_CLIENT_SECRET",

  /* OAuth API endpoints */
  tokenHost: "https://github.com/",
  tokenPath: "https://github.com/login/oauth/access_token",
  authorizePath: "https://github.com/login/oauth/authorize",

  /* User API endpoint */
  userApi: "https://api.github.com/user",
};

class OAuth {
  constructor(provider) {
    this.provider = provider;

    let config = this.config;
    this.authorizationCode = new AuthorizationCode({
      client: {
        id: config.clientId,
        secret: config.clientSecret
      },
      auth: {
        tokenHost: config.tokenHost,
        tokenPath: config.tokenPath,
        authorizePath: config.authorizePath
      }
    });
  }

  get config() {
    const cfg = {
      sessionExpiration: 60 * 60 * 8, // in seconds, this is 8 hours

      /* redirect_uri is the callback url after successful signin */
      redirect_uri: `${SITE_URL}/.netlify/functions/auth-callback`,
    }

    if(this.provider === "netlify") {
      Object.assign(cfg, netlifyConfig);
    } else if(this.provider === "github") {
      Object.assign(cfg, githubConfig);
    } else {
      throw new Error("Invalid provider passed to OAuth. Currently only `netlify` or `github` are supported.")
    }

    cfg.clientId = process.env[cfg.clientIdKey];
    cfg.clientSecret = process.env[cfg.clientSecretKey];

    if (!cfg.clientId || !cfg.clientSecret) {
      throw new Error(`MISSING REQUIRED ENV VARS. ${cfg.clientIdKey} and ${cfg.clientSecretKey} are required.`)
    }

    return cfg;
  }

  async getUser(token) {
    if(!token) {
      throw new Error("Missing authorization token.");
    }
  
    const response = await fetch(this.config.userApi, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  
    console.log( "[auth] getUser response status", response.status );
    if (response.status !== 200) {
      throw new Error(`Error ${await response.text()}`)
    }
  
    const data = await response.json()
    return data
  }
}

function getCookie(name, value, expiration) {
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

module.exports = {
  OAuth,
  tokens: {
    encode: function(token) {
      return Buffer.from(token, "utf8").toString("base64");
    },
    decode: function(token) {
      return Buffer.from(token, "base64").toString("utf8");
    }
  },
  getCookie
}
