// Set env-var: MC_CIPHER: e.g. export MC_CIPHER=990099
// RUN => deno run --allow-read --allow-write --allow-env test.ts
// TODO: resolve boolean true encryption/decryption error
// Unexpected token 'ü', ..."tatus": trü,
//     "is"... is not valid JSON

import { assertEquals, mcTest, postTestResult, } from "./test_deps.ts";
import { encryptFile, } from "./config.ts";

(async () => {
    console.log("\nSIMPLE-ENCRYPT AND DECRYPT TESTING START\n");
    const appDb = {
        dbType  : "postgres",
        hostname: "localhost",
        checkStatus: true,
        isSecure: false,
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

    // await mcTest({
    //     name    : "should decrypt JSON file successfully",
    //     testFunc: () => {
    //         const encodedFilePath = "./config.test.aes";
    //         const result = decryptEncodedFile(encodedFilePath);
    //         assertEquals(result.appDb.dbType, appDb.dbType, `dbType should be ${appDb.dbType}`);
    //         assertEquals(result.appDb.hostname, appDb.hostname, `hostname should be ${appDb.hostname}`);
    //         assertEquals(result.appDb.checkStatus, appDb.checkStatus, `dbType should be ${appDb.checkStatus}`);
    //         assertEquals(result.appDb.isSecure, appDb.isSecure, `dbType should be ${appDb.isSecure}`);
    //     },
    // });
    //
    // RSA encode / decode

    postTestResult();
    console.log("\nSIMPLE-ENCRYPT AND DECRYPT TESTING END\n");
})();
