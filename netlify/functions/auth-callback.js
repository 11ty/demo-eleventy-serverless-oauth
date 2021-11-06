const cookie = require("cookie");
const querystring = require("querystring");
const { config, oauth, tokens, getCookie } = require("./util/auth.js");
const { getUser } = require("./util/netlify-api");

const EXPIRATION_SECONDS = 60 * 60 * 8; // 8 hours

/* Function to handle netlify auth callback */
exports.handler = async (event, context) => {
  // Exit early
  if (!event.queryStringParameters) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Not authorized',
      })
    }
  }

  /* Grant the grant code */
  const code = event.queryStringParameters.code;

  /* state helps mitigate CSRF attacks & Restore the previous state of your app */
  const state = querystring.parse(event.queryStringParameters.state)

  try {
    console.log( "[auth-callback] Cookies", event.headers.cookie );
    let cookies = cookie.parse(event.headers.cookie);
    if(cookies._csrf !== state.csrf) {
      throw new Error("Missing or invalid CSRF token.");
    }

    /* Take the grant code and exchange for an accessToken */
    const accessToken = await oauth.getToken({
      code: code,
      redirect_uri: config.redirect_uri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    });

    const token = accessToken.token.access_token;
    console.log( "[auth-callback]", { token } );
    // Check that the user exists and is valid.
    const user = await getUser(token);

    const expiresSeconds = EXPIRATION_SECONDS;
    const URI = `${state.url}#csrf=${state.csrf}`;
    console.log( "[auth-callback]", { URI });

    /* Redirect user to authorizationURI */
    return {
      statusCode: 302,
      headers: {
        Location: URI,
        // This cookie *must* be HttpOnly
        'Set-Cookie': getCookie("_token", tokens.encode(token), expiresSeconds),
        'Cache-Control': 'no-cache' // Disable caching of this response
      },
      body: '' // return body for local dev
    }

  } catch (e) {
    console.log("[auth-callback]", 'Access Token Error', e.message)
    console.log("[auth-callback]", e)
    return {
      statusCode: e.statusCode || 500,
      body: JSON.stringify({
        error: e.message,
      })
    }
  }
}
