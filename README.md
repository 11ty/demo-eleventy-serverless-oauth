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

## Configuration

Templates can be secured with the following front matter:

```
---
permalink:
  dynamic: "/YOUR_PATH_HERE/"
secure:
  unauthenticatedRedirect: "/"
---
```

### Infrastructure

Not all providers are required. You can use one or more providers. If you only want a subset of these providers, just remove the Login buttons that you don’t want and don’t worry about the environment variables for that provider.

1. Create your OAuth app: [Netlify OAuth](https://app.netlify.com/user/applications) and/or [GitHub OAuth](https://github.com/settings/applications/new)
2. Add your environment variables to your `.env` file:
    * `NETLIFY_OAUTH_CLIENT_ID` and `NETLIFY_OAUTH_CLIENT_SECRET` are required for `Login with Netlify`
    * `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` are required for `Login with GitHub`