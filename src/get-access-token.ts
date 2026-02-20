/**
 * Get access_token from auth code - for apps on openservice.aliexpress.com (Overseas).
 * Official doc: AliExpress Open Platform - Seller authorization introduction
 * https://developer.alibaba.com/docs/doc.htm?treeId=727&articleId=120687&docType=1
 *
 * - Authorization: https://api-sg.aliexpress.com/oauth/authorize
 * - Get token: POST /auth/token/create to https://api-sg.aliexpress.com/rest
 * - Request body (JSON): app_key, app_secret, code
 * - System params: timestamp, sign_method=sha256, sign (HMAC_SHA256 per doc)
 * - API endpoint URLs: https://developer.alibaba.com/docs/doc.htm?treeId=727&articleId=120689
 * - Signature algorithm: https://developer.alibaba.com/docs/doc.htm?treeId=727&articleId=120692
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import type { IncomingMessage } from 'http';
import { signParams } from './utils/sign';

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
const CODE: string = process.env.AUTH_CODE ?? '';

const API_NAME = '/auth/token/create';
const BASE_URL = 'https://api-sg.aliexpress.com/rest';
const SIGN_METHOD = 'sha256';

const timestamp = String(Date.now());

const params: Record<string, string> = {
  app_key: APP_KEY,
  app_secret: APP_SECRET,
  code: CODE,
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
        const json: Record<string, unknown> = JSON.parse(data);
        if (json.access_token) {
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
