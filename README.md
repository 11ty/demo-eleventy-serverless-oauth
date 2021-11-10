# demo-eleventy-serverless-oauth

A demo project using OAuth to secure some of your Eleventy Serverless routes.

1. [Demo](https://demo-eleventy-serverless-oauth.netlify.app)
1. [Deploy your own to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/11ty/demo-eleventy-serverless-oauth)

---

* [Blog post on zachleat.com](https://www.zachleat.com/web/eleventy-login/)
* [Walk-through on YouTube](https://www.youtube.com/watch?v=At19o2Ox57Y)

## Run locally

```
npm install
npm run dev
```

Navigate to http://localhost:8888

The full login flow is supported on localhost, assuming the Redirect URI set in your OAuth Application is configured correctly.

## OAuth Application Providers

This example includes Netlify, GitHub, and GitLab providers. If you only want a subset of these providers, just remove the Login buttons that you don’t want and don’t worry about the relevant environment variables for that provider.

1. Create one or more OAuth applications:
    * [Netlify OAuth](https://app.netlify.com/user/applications/new)
    * [GitHub OAuth](https://github.com/settings/applications/new)
    * [GitLab](https://gitlab.com/-/profile/applications)
2. Add the appropriate environment variables to your `.env` file:
    * Netlify: `NETLIFY_OAUTH_CLIENT_ID` and `NETLIFY_OAUTH_CLIENT_SECRET`
    * GitHub: `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`
    * GitLab: `GITLAB_OAUTH_CLIENT_ID` and `GITLAB_OAUTH_CLIENT_SECRET`

Tip: I like to set up two OAuth applications, one for production and one for local development so that I don’t have to worry about juggling the different Redirect URIs in the provider’s web interface. e.g. this will need to be `http://localhost:8888/.netlify/functions/auth-callback` for local development.

## Add this to your Eleventy site

You will need a:
* static login form
* a secure serverless template

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

### Serverless Templates

Serverless templates can be secured with the following front matter (this example is YAML):

```
---
permalink:
  dynamic: "/YOUR_PATH_HERE/"
secure:
  unauthenticatedRedirect: "/"
---
```

The above will secure the path and redirect any unauthenticated requests to the URL of your choosing.

You can also conditionally render content inside of an insecure serverless template. Just check for the `user` global (you can rename this in `netlify/functions/dynamic/index.js`). Here’s an example of that:

```
---
permalink:
  dynamic: "/YOUR_PATH_HERE/"
---
{% if user %}
You are logged in!
<!-- Show Logout form -->
{% else %}
<!-- Show Login form -->
{% endif %} 
```

You can see an example of this in [the `everything-serverless` branch](https://github.com/11ty/demo-eleventy-serverless-oauth/compare/everything-serverless).

#### More detail

You may need to familiarize yourself with [Eleventy Serverless templates](https://www.11ty.dev/docs/plugins/serverless/#usage).

Relevant files:
* `.eleventy.js` adds the Elventy Serverless bundler plugin for the `dynamic` permalink.
* Eleventy Serverless `.gitignore` additions: `netlify/functions/dynamic/**` and 
`!netlify/functions/dynamic/index.js`
* Copy to your project:
  * `netlify/functions/dynamic/index.js`
  * `netlify/functions/util/*`
  * `netlify/functions/auth-before.js`
  * `netlify/functions/auth-callback.js`
