import emailjs from "@emailjs/browser";

const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || "service_bj5yuym";
const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || "template_fjqpzii";
const PUBLIC_KEY  = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string)  || "50xYTvUQzNcqDfsIh";

const KEY = (email: string) => `turfbook_otp::${email.toLowerCase().trim()}`;

function save(email: string, code: string) {
  localStorage.setItem(KEY(email), JSON.stringify({ code, exp: Date.now() + 10 * 60 * 1000 }));
}

function load(email: string): { code: string; exp: number } | null {
  try {
    const raw = localStorage.getItem(KEY(email));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clear(email: string) {
  localStorage.removeItem(KEY(email));
}

function make6(): string {
  const buf = new Uint8Array(4);
  crypto.getRandomValues(buf);
  const n = ((buf[0] << 24) | (buf[1] << 16) | (buf[2] << 8) | buf[3]) >>> 0;
  return String(100000 + (n % 900000));
}

export async function sendOTP(
  email: string,
  _createUser = true
): Promise<{ success: boolean; message?: string }> {
  const code = make6();
  save(email, code);                       // persist before network call

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      { to_email: email.trim(), otp_code: code, app_name: "TurfBook" },
      { publicKey: PUBLIC_KEY }
    );
    return { success: true };
  } catch (err) {
    console.error("[OTP] EmailJS error:", err);
    // OTP is still saved in localStorage — user just won't get the email
    return { success: false, message: "Could not send the email. Please try again." };
  }
}

export async function verifyOTP(
  email: string,
  token: string
): Promise<{ success: boolean; message?: string }> {
  const entry = load(email);
  const entered = token.replace(/\D/g, "").trim();

  if (!entry) {
    return { success: false, message: "No code found — please request a new one." };
  }
  if (Date.now() > entry.exp) {
    clear(email);
    return { success: false, message: "Code expired (10 min limit) — please request a new one." };
  }
  if (entry.code !== entered) {
    console.warn("[OTP] mismatch — stored:", entry.code, "entered:", entered);
    return { success: false, message: `Incorrect code. Please try again.` };
  }

  clear(email);
  return { success: true };
}
