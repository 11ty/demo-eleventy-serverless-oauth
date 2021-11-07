# eleventy-demo-serverless-oauth

A demo project using OAuth to secure some of your Eleventy Serverless routes.

1. [Demo on Netlify](https://demo-eleventy-serverless-oauth.netlify.app)
1. [Deploy your own to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/11ty/demo-eleventy-serverless-oauth)


## Run locally

```
npm install
npm run dev
```

Navigate to http://localhost:8888

The full login flow is supported on localhost, assuming the Redirect URI set in your OAuth Application is configured correctly.

## Configuration

You will need a:
* static login form
* a secure serverless template
* an OAuth Application provider

### Static login form

Does not have to be in a serverless template. Put it in a shared header on your site!

```
<form action="/.netlify/functions/auth-before">
  <input type="hidden" name="securePath" value="/YOUR_PATH_HERE/">
  <button type="submit" name="provider" value="netlify">Login with Netlify</button>
  <button type="submit" name="provider" value="github">Login with GitHub</button>
</form>
```

`securePath` should contain the URL to the secured serverless template (see next section).

### Secure Serverless Template

Serverless templates can be secured with the following front matter (this example is YAML):

```
---
permalink:
  dynamic: "/YOUR_PATH_HERE/"
secure:
  unauthenticatedRedirect: "/"
---
```

You may need to familiarize yourself with [Eleventy Serverless templates](https://www.11ty.dev/docs/plugins/serverless/#usage).

Relevant files:
* `.eleventy.js` adds the bundler plugin for the `dynamic` permalink.
* The OAuth specific serverless function code: `netlify/functions/dynamic/index.js`
* The relevant entries in `.gitignore`

### OAuth Application Providers

This example includes providers via Netlify and GitHub. You can use one or more of these providers. If you only want a subset of these providers, just remove the Login buttons that you don’t want and don’t worry about the relevant environment variables for that provider.

1. Create your OAuth application: [Netlify OAuth](https://app.netlify.com/user/applications) and/or [GitHub OAuth](https://github.com/settings/applications/new)
2. Add the appropriate environment variables to your `.env` file:
    * `NETLIFY_OAUTH_CLIENT_ID` and `NETLIFY_OAUTH_CLIENT_SECRET` are required for `Login with Netlify`
    * `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` are required for `Login with GitHub`

Warning: for local development you may need to set your Redirect URI in your OAuth application (configured through the provider web UI) to `http://localhost:8888/.netlify/functions/auth-callback` temporarily.