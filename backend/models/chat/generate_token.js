import crypto from "crypto";

const generate_token = (length = 32) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

export default generate_token;
