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

1. Create your OAuth app (this demo uses [Netlify OAuth](https://app.netlify.com/user/applications))
2. Add your environment variables to your `.env` file: e.g. `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`
