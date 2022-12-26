// RUN => deno run --allow-read --allow-env decryptEncodedFile.ts
import { decryptEncodedFile, } from "./config.ts";

const encodedFile = "./config.aes";

// For testing only
decryptEncodedFile(encodedFile);
