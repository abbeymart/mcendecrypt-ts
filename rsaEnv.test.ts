// Set env-var: MC_RSA_PUBLIC_KEY and MC_RSA_PRIVATE_KEY:
// e.g. export MC_RSA_PUBLIC_KEY="[5, 8989]" | export MC_RSA_PRIVATE_KEY="[5069, 8989]"
// RUN => deno run --allow-read --allow-write --allow-env rsaEnv.test.ts

import { assertEquals, mcTest, postTestResult, } from "./test_deps.ts";
import { rsaDecode, rsaEncode, } from "./config.ts";

(async () => {
    console.log("\nRSA-SIMPLE-ENCRYPT AND DECRYPT TESTING START (with pre-generate keys, ENV-CODE-VARS)\n");
    const appDb = {
        dbType  : "postgres",
        hostname: "localhost",
        checkStatus: true,
        isSecure: false,
    }

    // Testing with pre-generated random keys
    await mcTest({
        name    : "RSA: should encrypt JSON file successfully",
        testFunc: () => {
            const filePath = "./config.test.json";
            const encodedFilePath = "./config.test2.rsa";
            rsaEncode(filePath, encodedFilePath);
            // validate encodedFilePath
            const resText = Deno.readTextFileSync(encodedFilePath)
            assertEquals(resText !== "", true, "response text should not be empty");
        },
    });

    await mcTest({
        name    : "RSA: should decrypt JSON file successfully",
        testFunc: () => {
            const encodedFilePath = "./config.test2.rsa";
            const result = rsaDecode(encodedFilePath);
            assertEquals(result.appDb.dbType, appDb.dbType, `dbType should be ${appDb.dbType}`);
            assertEquals(result.appDb.hostname, appDb.hostname, `hostname should be ${appDb.hostname}`);
            assertEquals(result.appDb.checkStatus, appDb.checkStatus, `dbType should be ${appDb.checkStatus}`);
            assertEquals(result.appDb.isSecure, appDb.isSecure, `dbType should be ${appDb.isSecure}`);
        },
    });


    postTestResult();
    console.log("\nRSA-SIMPLE-ENCRYPT AND DECRYPT TESTING END\n");
})();
