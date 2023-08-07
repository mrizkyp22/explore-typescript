import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); // Generate a 256-bit key

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedText: string, secretKey: Buffer): string => {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
};

export const loadedSecretKey = secretKey; // Replace with your secure key loading logic
