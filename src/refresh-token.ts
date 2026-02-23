/**
 * Refresh access_token using refresh_token - for apps on openservice.aliexpress.com (Overseas).
 * Official doc: AliExpress Open Platform - Seller authorization introduction
 * https://developer.alibaba.com/docs/doc.htm?treeId=727&articleId=120687&docType=1
 *
 * "Use /auth/token/refresh to refresh the access token. The returned data structure by
 * /auth/token/refresh is the same with that by getting the access token with authorization code."
 * - POST /auth/token/refresh to https://api-sg.aliexpress.com/rest
 * - Request body (JSON): app_key, app_secret, refresh_token (from .env)
 * - System params: timestamp, sign_method=sha256, sign (HMAC_SHA256, prefix = API path)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import type { IncomingMessage } from 'http';
import { signParams } from './utils/sign';
import type { TokenCreateResponse } from './types';

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
const REFRESH_TOKEN: string = process.env.refresh_token ?? '';

const API_NAME = '/auth/token/refresh';
const BASE_URL = 'https://api-sg.aliexpress.com/rest';
const SIGN_METHOD = 'sha256';

const timestamp = String(Date.now());

const params: Record<string, string> = {
  app_key: APP_KEY,
  app_secret: APP_SECRET,
  refresh_token: REFRESH_TOKEN,
  sign_method: SIGN_METHOD,
  timestamp,
};

params.sign = signParams(params, APP_SECRET, { prefix: API_NAME });

const body = JSON.stringify(params);

const u = new URL(BASE_URL + API_NAME);
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
        const json = JSON.parse(data) as TokenCreateResponse;
        if (json.error_response) {
          console.log('Error:', json.error_response.msg ?? json.error_response.code);
        } else if (json.access_token) {
          console.log('\naccess_token:', json.access_token);
          console.log('expires_in:', json.expires_in);
          if (json.refresh_token) console.log('refresh_token:', json.refresh_token);
        }
      } catch {
        // ignore parse error
      }
    });
  }
);
req.on('error', (e: Error) => console.error(e));
req.write(body);
req.end();
