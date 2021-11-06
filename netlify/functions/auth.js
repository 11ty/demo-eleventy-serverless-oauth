const { config, oauth, getCookie } = require("./util/auth.js");

/* Do initial auth redirect */
exports.handler = async (event, context) => {

  if (!event.queryStringParameters) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'No token found',
      })
    }
  }

  const csrfToken = event.queryStringParameters._auth_csrf;
  const redirectUrl = event.queryStringParameters.url

  /* Generate authorizationURI */
  const authorizationURI = oauth.authorizeURL({
    redirect_uri: config.redirect_uri,
    /* Specify how your app needs to access the user’s account. */
    scope: '',
    /* State helps mitigate CSRF attacks & Restore the previous state of your app */
    state: `url=${redirectUrl}&csrf=${csrfToken}`,
  });
  console.log( "[auth-start] SETTING COOKIE" );
  /* Redirect user to authorizationURI */
  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': getCookie("_csrf", csrfToken, 60*2), // 2 minutes
      Location: authorizationURI,
      'Cache-Control': 'no-cache' // Disable caching of this response
    },
    body: '' // return body for local dev
  }
}
