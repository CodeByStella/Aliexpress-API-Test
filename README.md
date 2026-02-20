# Aliexpress test

TypeScript scripts for [AliExpress Open Platform](https://openservice.aliexpress.com/) (Overseas / openservice.aliexpress.com): get access token from auth code and search products by keyword.

## Requirements

- Node.js 18+
- An app on [openservice.aliexpress.com](https://openservice.aliexpress.com/) with App Key and App Secret

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy the env example and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:
   - `app_key` – from your app in the console
   - `app_secret` – from your app in the console
   - `REDIRECT_URI` – callback URL configured in your app
   - `AUTH_CODE` – one-time code from the OAuth authorize flow (only needed for getting tokens)
   - `access_token` / `refresh_token` – after running the token script once, paste them here for the search script

3. Build TypeScript:

   ```bash
   npm run build
   ```

## Scripts

| Command          | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `npm run build`  | Compile TypeScript in `src/` to `dist/`                                                   |
| `npm run token`  | Exchange `AUTH_CODE` for `access_token` and `refresh_token` (POST to api-sg token create) |
| `npm run search` | Search products by keyword “mouse” for Japan (JP, JPY) via aliexpress.ds.text.search      |

## Getting an access token

1. In your app settings, set the redirect URI and get the authorize URL:
   - Authorize URL: `https://api-sg.aliexpress.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=YOUR_REDIRECT_URI&client_id=YOUR_APP_KEY`
2. Open that URL in a browser, sign in, and authorize. You’ll be redirected to your `REDIRECT_URI` with a `code` query parameter.
3. Put that `code` in `.env` as `AUTH_CODE`.
4. Run `npm run token`. Copy the printed `access_token` and `refresh_token` into `.env`.

## References

- [Seller authorization (token)](https://developer.alibaba.com/docs/doc.htm?treeId=727&articleId=120687&docType=1)
- [aliexpress.ds.text.search](https://openservice.aliexpress.com/doc/doc.htm#/?docId=1698)

## License

MIT
