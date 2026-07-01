export const AUTH_COOKIE = "equitylens_session";
export const AUTH_NAME_COOKIE = "equitylens_name";
export const AUTH_EMAIL_COOKIE = "equitylens_email";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface UserSession {
  name: string;
  email: string;
}

function writeCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const key = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(key));
  if (!found) return null;
  return decodeURIComponent(found.slice(key.length));
}

export function setAuthSession(session: UserSession) {
  writeCookie(AUTH_COOKIE, "1");
  writeCookie(AUTH_NAME_COOKIE, session.name);
  writeCookie(AUTH_EMAIL_COOKIE, session.email);

  if (typeof window !== "undefined") {
    localStorage.setItem("auth_profile", JSON.stringify({
      ...session,
      signedInAt: new Date().toISOString(),
    }));
  }
}

export function clearAuthSession() {
  writeCookie(AUTH_COOKIE, "", 0);
  writeCookie(AUTH_NAME_COOKIE, "", 0);
  writeCookie(AUTH_EMAIL_COOKIE, "", 0);

  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_profile");
  }
}

export function getAuthSession(): UserSession | null {
  const token = readCookie(AUTH_COOKIE);
  if (token !== "1") return null;

  const name = readCookie(AUTH_NAME_COOKIE) ?? "User";
  const email = readCookie(AUTH_EMAIL_COOKIE) ?? "user@example.com";
  return { name, email };
}
