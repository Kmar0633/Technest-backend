
import crypto from "crypto";
import jwt from "jsonwebtoken";
const decodeText = (text) => {
  const encryptionKey = process.env.ENCRYPT_KEY;
  const cipherBytes = Buffer.from(text, "base64");

  const pdb = crypto.pbkdf2Sync(
    encryptionKey,
    Buffer.from([
      0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65,
      0x76,
    ]),
    1000,
    48,
    "sha1"
  );
  const key = pdb.subarray(0, 32);
  const iv = pdb.subarray(32, 48);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(cipherBytes);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
};

const encryptText = (text) => {
  const encryptionKey = process.env.ENCRYPT_KEY;
  const salt = Buffer.from([
    0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65,
    0x76,
  ]);

  const pdb = crypto.pbkdf2Sync(encryptionKey, salt, 1000, 48, 'sha1');
  const key = pdb.subarray(0, 32);
  const iv = pdb.subarray(32, 48);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('base64');
};


const generateAccessToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

const verifyBearerToken = (authHeader,res) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};
export default {
  decodeText,
  encryptText,
  verifyBearerToken,
  generateAccessToken,
  generateRefreshToken
}