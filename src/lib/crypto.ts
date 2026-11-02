import CryptoJS from "crypto-js";

export function generateKey(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export function encrypt(
  plaintext: string,
  keyHex: string
): { ciphertext: string; ivHex: string } {
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv  = CryptoJS.lib.WordArray.random(16);
  const ivHex = CryptoJS.enc.Hex.stringify(iv);

  const result = CryptoJS.AES.encrypt(plaintext, key, {
    iv,
    mode:    CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    ciphertext: result.ciphertext.toString(CryptoJS.enc.Base64),
    ivHex,
  };
}

export function buildFile(keyHex: string, ivHex: string, ciphertext: string): string {
  return [
    "# Encryptie Export",
    `key: ${keyHex}`,
    `iv: ${ivHex}`,
    `ciphertext: ${ciphertext}`,
    "algorithm: AES-256-CBC",
    `created: ${new Date().toISOString()}`,
    "",
  ].join("\n");
}