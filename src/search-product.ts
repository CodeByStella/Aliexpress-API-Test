/**
 * aliexpress.ds.text.search - Search products by keyword.
 * Doc: https://openservice.aliexpress.com/doc/doc.htm?spm=a2o9m.11193487.0.0.3405ee0cEkGYMz#/?docId=1698
 *
 * API: GET/POST aliexpress.ds.text.search
 * PHP demo: URL = "https://api-sg.aliexpress.com/sync"
 * Required: keyWord, local, countryCode, currency
 * Japan: countryCode=JP, currency=JPY, local=ja_JP
 * Uses same signature as rest (HMAC_SHA256, sorted params, no API name prefix).
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as https from 'https';
import type { IncomingMessage } from 'http';

function loadEnv(envPath: string): void {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .forEach((line: string) => {
      const m = line.match(/^\s*([^#=]+)=(.*)$/);
      if (m) {
        const key = m[1].trim();
        const val = m[2].trim().replace(/^["']|["']$/g, '').replace(/\r$/, '');
        process.env[key] = val;
      }
    });
}

const envPath = path.join(process.cwd(), '.env');
loadEnv(envPath);

const APP_KEY: string = process.env.app_key ?? '';
const APP_SECRET: string = process.env.app_secret ?? '';
const ACCESS_TOKEN: string = process.env.access_token ?? '';

const API_NAME = 'aliexpress.ds.text.search';
const SYNC_URL = 'https://api-sg.aliexpress.com/sync';
const SIGN_METHOD = 'sha256';

const timestamp = String(Date.now());

const params: Record<string, string> = {
  method: API_NAME,
  app_key: APP_KEY,
  access_token: ACCESS_TOKEN,
  sign_method: SIGN_METHOD,
  timestamp,
  keyWord: 'mouse',
  local: 'ja_JP',
  countryCode: 'JP',
  currency: 'JPY',
  pageSize: '20',
  pageIndex: '1',
};

const sortedKeys = Object.keys(params).sort();
const signString = sortedKeys.map((k) => k + params[k]).join('');
const sign = crypto
  .createHmac('sha256', APP_SECRET)
  .update(signString, 'utf8')
  .digest('hex')
  .toUpperCase();

params.sign = sign;

const body = JSON.stringify(params);

const u = new URL(SYNC_URL);
const req = https.request(
  {
    hostname: u.hostname,
    path: u.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body, 'utf8'),
    },
  },
  (res: IncomingMessage) => {
    let data = '';
    res.on('data', (chunk: Buffer | string) => {
      data += typeof chunk === 'string' ? chunk : chunk.toString();
    });
    res.on('end', () => {
      console.log('HTTP status:', res.statusCode);
      console.log('Response:', data);
      try {
        const json: unknown = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } catch {
        // ignore parse error
      }
    });
  }
);
req.on('error', (e: Error) => console.error(e));
req.write(body);
req.end();
