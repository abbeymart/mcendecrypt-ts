import { Caesar, } from "./deps.ts";

export type ValueType =
    | Record<string, unknown>
    | Array<Record<string, unknown>>
    | string
    | number
    | Array<string>
    | Array<number>
    | Date
    | Array<Date>
    | boolean
    | Array<boolean>
    | { [key: string]: ValueType }
    | unknown;

export interface ObjectType {
    [key: string]: ValueType;
}

export const encryptToText = (textToEncode: string, cipher: number): string => {
    try {
        return Caesar.CaesarEncoding(textToEncode, cipher);
    } catch (e) {
        console.error("process-encryption-error: ", e);
        throw e;
    }

}

export const decryptTextToObject = (encodedText: string, cipher: number): ObjectType => {
    try {
        const decryptedText = Caesar.CaesarDecoding(encodedText, cipher);
        return JSON.parse(decryptedText);
    } catch (e) {
        console.error("process-decryption-error: ", e);
        throw e;
    }
}

// encryptFile function encrypts file(currently JSON), with the specified MC_CIPHER environment variable.
// MC_CIPHER must be of type number.
export const encryptFile = (filePath: string, encodedFilePath: string) => {
    try {
        const cipherCode = Number(Deno.env.get("MC_CIPHER"));
        if (!cipherCode) {
            console.error("\nEnvironment variable MC_CIPHER, of type number, is required\n");
            Deno.exit(1);
        }
        // read file
        const fileContent = Deno.readTextFileSync(filePath);
        // perform encryption
        const encodedText = encryptToText(fileContent, cipherCode);
        // store/write the encoded file content to file
        Deno.writeTextFileSync(encodedFilePath, encodedText);
        console.log("\nEncryption completed successfully and written to: ", encodedFilePath);
    } catch (e) {
        console.error("encryption-error: ", e);
        throw e;
    }
}


// decryptEncodedFile function decrypts encrypted file(currently JSON), with the specified MC_CIPHER environment variable.
// MC_CIPHER must be of type number and must match the same value specified for the file encryption.
export const decryptEncodedFile = (encodedFilePath: string): ObjectType => {
    try {
        // cipherCode: number
        const cipherCode = Number(Deno.env.get("MC_CIPHER"));
        if (!cipherCode) {
            console.error("\nEnvironment variable MC_CIPHER, of type number, is required\n. It must match the same value specified for the file encryption.\n");
            Deno.exit(1);
        }
        // read the encodedText from file
        const encodedTextContent = Deno.readTextFileSync(encodedFilePath);
        // perform decryption
        const decodedValue = decryptTextToObject(encodedTextContent, cipherCode);
        // log the decodedObject value
        // console.log("\ndecodedObject: ", decodedValue, "\n");
        console.log("\nDecryption completed successfully for: ", encodedFilePath);
        return decodedValue;
    } catch (e) {
        console.error("decryption-error: ", e);
        throw e;
    }

}
