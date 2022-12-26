// RUN => deno run --allow-read --allow-write --allow-env encryptFile.ts
import { encryptFile, } from "./config.ts";

const filePath = "./config.json";
const encodedFilePath = "./config.aes";

// RUN encryption function
encryptFile(filePath, encodedFilePath);
