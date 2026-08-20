const SESSION_COOKIE = "mongo-user-session";
const SESSION_SECRET = process.env.AUTH_SECRET || "local-development-auth-secret";

export type UserRole = "buyer" | "seller" | "admin";

const encode = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const decode = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(
    Uint8Array.from(binary, (character) => character.charCodeAt(0)),
  );
};

const getKey = () =>
  crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const sign = async (value: string) => {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getKey(),
    new TextEncoder().encode(value),
  );
  return encode(String.fromCharCode(...new Uint8Array(signature)));
};

export async function createUserSession(
  userId: string,
  email: string,
  role: UserRole = "buyer",
) {
  const payload = encode(
    JSON.stringify({
      userId,
      email,
      role,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }),
  );
  return `${payload}.${await sign(payload)}`;
}

export async function verifyUserSession(token: string | undefined) {
  if (!token) return null;

  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      Uint8Array.from(decode(signature), (character) => character.charCodeAt(0)),
      new TextEncoder().encode(payload),
    );

    if (!valid) return null;

    const session = JSON.parse(decode(payload)) as {
      userId: string;
      email: string;
      role?: UserRole;
      exp: number;
    };

    return session.exp > Date.now()
      ? { ...session, role: session.role || "buyer" }
      : null;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
