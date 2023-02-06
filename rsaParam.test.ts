// RUN => deno run --allow-read --allow-write --allow-env rsaParam.test.ts

import { assertEquals, mcTest, postTestResult, } from "./test_deps.ts";
import { rsaDecode, rsaEncode, } from "./config.ts";
import { RSA } from "https://deno.land/x/encryption_lib@0.1.4/src/rsa.ts";

(async () => {
    console.log("\nRSA-SIMPLE-ENCRYPT AND DECRYPT TESTING START (Auto-generated-keys)\n");
    const appDb = {
        dbType  : "postgres",
        hostname: "localhost",
        checkStatus: true,
        isSecure: false,
    }

    // Generate keys
    const rsaKeys = RSA.KeyGenerator()
    console.log(rsaKeys) // [[3,1219],[763,1219]]
    const rsaPublicKey = rsaKeys[0]
    const rsaPrivateKey = rsaKeys[1]

    // Testing with randomly generated keys
    await mcTest({
        name    : "RSA: should encrypt JSON file successfully",
        testFunc: () => {
            const filePath = "./config.test.json";
            const encodedFilePath = "./config.test.rsa";
            rsaEncode(filePath, encodedFilePath, rsaPublicKey);
            // validate encodedFilePath
            const resText = Deno.readTextFileSync(encodedFilePath)
            assertEquals(resText !== "", true, "response text should not be empty");
        },
    });

    await mcTest({
        name    : "RSA: should decrypt JSON file successfully",
        testFunc: () => {
            const encodedFilePath = "./config.test.rsa";
            const result = rsaDecode(encodedFilePath, rsaPrivateKey);
            assertEquals(result.appDb.dbType, appDb.dbType, `dbType should be ${appDb.dbType}`);
            assertEquals(result.appDb.hostname, appDb.hostname, `hostname should be ${appDb.hostname}`);
            assertEquals(result.appDb.checkStatus, appDb.checkStatus, `dbType should be ${appDb.checkStatus}`);
            assertEquals(result.appDb.isSecure, appDb.isSecure, `dbType should be ${appDb.isSecure}`);
        },
    });

    postTestResult();
    console.log("\nSIMPLE-ENCRYPT AND DECRYPT TESTING END\n");
})();
