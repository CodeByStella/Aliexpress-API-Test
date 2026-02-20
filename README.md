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

---

## Test Log

```
{
  "aliexpress_ds_text_search_response": {
    "code": "00",
    "data": {
      "pageIndex": 1,
      "pageSize": 20,
      "totalCount": 5839,
      "products": {
        "selection_search_product": [
          {
            "originalPrice": "45.02",
            "originalPriceCurrency": "CNY",
            "salePrice": "21.16",
            "discount": "53%",
            "itemMainPic": "https://ae01.alicdn.com/kf/Sba7a6851f61c48f69bae5c7a8ad1558a3.jpg",
            "title": "2025年最新高品質人間工学に基づいたゲーミングマウス、デスクトップパソコンとノートパソコン用、4ボタンUSB RGBバックライトマウス",
            "type": "search",
            "score": "4.5",
            "itemId": "1005009859848818",
            "targetSalePrice": "485",
            "cateId": "7,200001081,200001082,70805",
            "targetOriginalPriceCurrency": "JPY",
            "originMinPrice": {
              "thousandsChar": ",",
              "shipToCountry": "JP",
              "decimalPointChar": ".",
              "cent": 485,
              "currencySymbolPosition": "end",
              "currencySymbol": "円",
              "showDecimal": true,
              "decimalStr": "",
              "currencyCode": "JPY",
              "version": "V1",
              "formatPrice": "485円",
              "integerStr": "485"
            },
            "evaluateRate": "90.2",
            "salePriceFormat": "485円",
            "orders": "4,000+",
            "targetOriginalPrice": "1032",
            "itemUrl": "//www.aliexpress.com/item/1005009859848818.html?skuId=12000050396648612&pdp_ext_f=%7B%22sku_id%22%3A%2212000050396648612%22%7D?appkey=528150",
            "salePriceCurrency": "CNY"
          },
          {
            "originalPrice": "48.78",
            "originalPriceCurrency": "CNY",
            "salePrice": "23.41",
            "discount": "52%",
            "itemMainPic": "https://ae01.alicdn.com/kf/S117ae128ebb8477f84b294a2534882cb1.jpg",
            "title": "ワイヤレスマウス 2.4GHz Bluetooth 充電式マウス静かな人間工学に基づいたゲーミングマウス USB バックライト付き 1600DPI マウス PC ラップトップ用",
            "type": "search",
            "score": "4.7",
            "itemId": "1005010119248627",
            "targetSalePrice": "537",
            "cateId": "44,100000310,202177812",
            "targetOriginalPriceCurrency": "JPY",
            "originMinPrice": {
              "thousandsChar": ",",
              "shipToCountry": "JP",
              "decimalPointChar": ".",
              "cent": 537,
              "currencySymbolPosition": "end",
              "currencySymbol": "円",
              "showDecimal": true,
              "decimalStr": "",
              "currencyCode": "JPY",
              "version": "V1",
              "formatPrice": "537円",
              "integerStr": "537"
            },
            "evaluateRate": "93.6",
            "salePriceFormat": "537円",
            "orders": "3,000+",
            "targetOriginalPrice": "1118",
            "itemUrl": "//www.aliexpress.com/item/1005010119248627.html?skuId=12000051209436734&pdp_ext_f=%7B%22sku_id%22%3A%2212000051209436734%22%7D?appkey=528150",
            "salePriceCurrency": "CNY"
          }
        ]
      }
    },
    "request_id": "2151e4fa17715823354902472",
    "_trace_id_": "21413d5a17715823354883283e37bc"
  }
}
```
