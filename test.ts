// RUN => deno run --allow-read --allow-write --allow-env test.ts
// Set env-var: MC_CIPHER

import { assertEquals, mcTest, postTestResult, } from "./test_deps.ts";
import { decryptEncodedFile, encryptFile, } from "./config.ts";

(async () => {
    console.log("\nSIMPLE-ENCRYPT AND DECRYPT TESTING START\n");
    const appDb = {
        dbType  : "postgres",
        hostname: "localhost",
    }

    await mcTest({
        name    : "should encrypt JSON file successfully",
        testFunc: () => {
            const filePath = "./config.test.json";
            const encodedFilePath = "./config.test.aes";
            encryptFile(filePath, encodedFilePath);
            // validate encodedFilePath
            const resText = Deno.readTextFileSync(encodedFilePath)
            assertEquals(resText !== "", true, "response text should not be empty");
        },
    });

    await mcTest({
        name    : "should decrypt JSON file successfully",
        testFunc: () => {
            const encodedFilePath = "./config.aes";
            const result = decryptEncodedFile(encodedFilePath);
            assertEquals(result.appDb.dbType, appDb.dbType, `dbType should be ${appDb.dbType}`);
            assertEquals(result.appDb.hostname, appDb.hostname, `hostname should be ${appDb.hostname}`);
        },
    });

    postTestResult();
    console.log("\nSIMPLE-ENCRYPT AND DECRYPT TESTING END\n");
})();
