type LogLevel = "info" | "warn" | "error";

type LoggerOptions = {
  enabled?: boolean;
  level?: LogLevel;
  maxLen?: number;
};

const isEnabledDefault = () => {
  const env = (import.meta as any)?.env;
  const flag = String(env?.VITE_MOVE_DEBUG_LOGS || "").toLowerCase();
  const dev = Boolean(env?.DEV);
  return dev || flag === "1" || flag === "true";
};

const isSensitiveKey = (k: string) => {
  const key = k.toLowerCase();
  return (
    key.includes("token") ||
    key.includes("apikey") ||
    key.includes("api_key") ||
    key.includes("authorization") ||
    key === "password" ||
    key === "secret"
  );
};

const safeStringify = (value: any, maxLen: number) => {
  try {
    const json = JSON.stringify(
      value,
      (k, v) => (isSensitiveKey(k) ? "[REDACTED]" : v),
      2
    );
    if (json.length <= maxLen) return json;
    return json.slice(0, maxLen) + `\n...[truncated ${json.length - maxLen} chars]`;
  } catch {
    try {
      const s = String(value);
      return s.length <= maxLen ? s : s.slice(0, maxLen) + `\n...[truncated ${s.length - maxLen} chars]`;
    } catch {
      return "[unserializable]";
    }
  }
};

export const moveLog = (label: string, payload?: any, opts: LoggerOptions = {}) => {
  const enabled = opts.enabled ?? isEnabledDefault();
  if (!enabled) return;

  const level: LogLevel = opts.level ?? "info";
  const maxLen = opts.maxLen ?? 8000;

  const prefix = `%cMOVE%c ${label}`;
  const style1 = "background:#0ea5e9;color:#020617;padding:2px 6px;border-radius:6px;font-weight:900";
  const style2 = "color:#94a3b8";

  const text = payload === undefined ? "" : safeStringify(payload, maxLen);

  if (level === "error") console.error(prefix, style1, style2, text);
  else if (level === "warn") console.warn(prefix, style1, style2, text);
  else console.log(prefix, style1, style2, text);
};
