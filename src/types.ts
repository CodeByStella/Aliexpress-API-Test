/**
 * Response types from official AliExpress Open Platform docs.
 * - Token: https://developer.alibaba.com/docs/doc.htm?treeId=727&articleId=120687&docType=1 (Seller authorization introduction)
 * - Search: https://openservice.aliexpress.com/doc/doc.htm#/?docId=1698 (aliexpress.ds.text.search)
 */

/** Error response (common shape across APIs) */
export interface AliExpressErrorResponse {
  error_response?: {
    type?: string;
    code?: string;
    msg?: string;
    request_id?: string;
    _trace_id_?: string;
  };
}

/** /auth/token/create – Return parameters (doc: access_token, expire_time, refresh_token, user_nick, user_id; sample also has account_platform, refresh_expires_in, expires_in, seller_id, account, code, request_id) */
export interface TokenCreateResponse extends AliExpressErrorResponse {
  access_token?: string;
  expire_time?: number;
  refresh_token?: string;
  user_nick?: string;
  user_id?: string;
  account_platform?: string;
  refresh_expires_in?: number;
  expires_in?: number;
  seller_id?: string;
  account?: string;
  code?: string;
  request_id?: string;
  locale?: string;
  sp?: string;
  refresh_token_valid_time?: number;
  havana_id?: string;
  _trace_id_?: string;
}

/** aliexpress.ds.text.search – Successful response (doc: data.pageIndex, pageSize, totalCount, products[]; product fields as in Parameter/Successful response) */
export interface DsTextSearchProduct {
  productVideoUrl?: string;
  originalPrice?: string;
  originalPriceCurrency?: string;
  salePrice?: string;
  discount?: string;
  itemMainPic?: string;
  title?: string;
  originalPriceFormat?: string;
  score?: string;
  itemId?: string;
  targetSalePrice?: string;
  cateId?: string;
  targetOriginalPriceCurrency?: string;
  originMinPrice?: string;
  evaluateRate?: string;
  salePriceFormat?: string;
  orders?: string;
  targetOriginalPrice?: string;
  itemUrl?: string;
  salePriceCurrency?: string;
  type?: string;
}

export interface DsTextSearchData {
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  products?: {
    selection_search_product?: DsTextSearchProduct[];
  };
}

export interface DsTextSearchResult {
  msg?: string;
  code?: string;
  data?: DsTextSearchData;
}

/** Full HTTP response for aliexpress.ds.text.search (includes request_id; actual API uses aliexpress_ds_text_search_response) */
export interface DsTextSearchResponse extends AliExpressErrorResponse {
  aliexpress_ds_text_search_response?: DsTextSearchResult;
  request_id?: string;
  _trace_id_?: string;
}
