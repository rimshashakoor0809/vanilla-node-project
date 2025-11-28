export function cookieHelper(req, res, next) {

  res.cookie = (name, value, options = {}) => {
    let cookie = `${name}=${encodeURIComponent(value)}`;

    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options.expires) cookie += `; Expires=${options.expires.toUTCString()}`;
    if (options.httpOnly) cookie += "; HttpOnly";
    if (options.secure) cookie += "; Secure";
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

    const current = res.getHeader("Set-Cookie");

    if (!current) {
      res.setHeader("Set-Cookie", [cookie]);
    } else if (Array.isArray(current)) {
      res.setHeader("Set-Cookie", [...current, cookie]);
    } else {
      res.setHeader("Set-Cookie", [current, cookie]);
    }
  };

  next();
}

export function cookieParser(req, res, next) {
  req.cookies = {};

  const header = req.headers?.cookie;
  if (!header) return next();

  const cookies = header.split(';');

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split('=');
    if (!key) continue;

    const trimmedKey = key.trim();
    const rawValue = rest.join('=').trim();

    try {
      req.cookies[trimmedKey] = decodeURIComponent(rawValue);
    } catch {
      req.cookies[trimmedKey] = rawValue;
    }
  }
  next();
}

