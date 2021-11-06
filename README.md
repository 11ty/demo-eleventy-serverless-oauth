# eleventy-demo-serverless-oauth

A demo project using OAuth to secure some of your Eleventy Serverless routes.

## Run locally

```
npm install
npm run dev
```

Navigate to http://localhost:8888

## Infra Setup

1. Create your OAuth app (this demo uses Netlify OAuth)
2. Add your environment variables to your `.env` file: e.g. `NETLIFY_OAUTH_CLIENT_ID` and `NETLIFY_OAUTH_CLIENT_SECRET`
