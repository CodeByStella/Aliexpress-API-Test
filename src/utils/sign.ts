import * as crypto from 'crypto';

/**
 * AliExpress Open Platform signature (HMAC-SHA256).
 * Sorts params by key, builds string: optional prefix + key1+value1+key2+value2+...
 * Then HMAC-SHA256(secret, string), hex uppercase.
 */
export function signParams(
  params: Record<string, string>,
  appSecret: string,
  options?: { prefix?: string }
): string {
  const prefix = options?.prefix ?? '';
  const sortedKeys = Object.keys(params).sort();
  const signString = prefix + sortedKeys.map((k) => k + params[k]).join('');
  return crypto
    .createHmac('sha256', appSecret)
    .update(signString, 'utf8')
    .digest('hex')
    .toUpperCase();
}
