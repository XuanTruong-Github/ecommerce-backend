import { Request } from 'express';
const MAX_COOKIE_CHUNKS = 8;
const SESSION_COOKIE_NAME = ['better-auth.session_token', '__Secure-better-auth.session_token'];
export function extractBearerToken(headers: Request['headers']) {
  const raw = headers.authorization ?? headers.Authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !value.toLocaleLowerCase().startsWith('bearer')) return null;
  const token = value.slice(7).trim();
  if (!token) return null;
  try {
    return decodeURIComponent(token);
  } catch {
    return token;
  }
}

function cookieValue(header: string, name: string): string | null {
  const parts = header.split(';');
  for (const part of parts) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    if (key === name) {
      return part.slice(index + 1).trim();
    }
  }
  return null;
}
function readSessionCookieValue(header: string, baseName: string): string | null {
  const whole = cookieValue(header, baseName);
  if (whole) return whole;
  const chunks: string[] = [];
  for (let i = 0; i < MAX_COOKIE_CHUNKS; i++) {
    const chunk = cookieValue(header, `${baseName}.${i}`);
    if (chunk === null) break;
    chunks.push(chunk);
  }
  return chunks.length > 0 ? chunks.join('') : null;
}
function stripSignature(value: string): string {
  const lastDot = value.lastIndexOf('.');
  return lastDot > 0 ? value.slice(0, lastDot) : value;
}

export function extractSessionTokenFromHeaders(headers: Request['headers']) {
  const bearer = extractBearerToken(headers);
  if (bearer) return stripSignature(bearer);
  const rawCookie = headers.cookie ?? headers.Cookie;
  const cookieHeader = Array.isArray(rawCookie) ? rawCookie[0] : rawCookie;
  if (!cookieHeader) return null;
  for (const name of SESSION_COOKIE_NAME) {
    const value = readSessionCookieValue(cookieHeader, name);
    if (value) return stripSignature(value);
  }
  return null;
}
