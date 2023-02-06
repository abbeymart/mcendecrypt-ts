import { Caesar, RSA, } from "./deps.ts";

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
export const encryptFile = (filePath: string, encodedFilePath: string, cCode = 0) => {
    try {
        const cipherCode = Number(Deno.env.get("MC_CIPHER")) || cCode;
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
// TODO: could not decode boolean value of true
export const decryptEncodedFile = (encodedFilePath: string, cCode = 0): ObjectType => {
    try {
        // cipherCode: number
        const cipherCode = Number(Deno.env.get("MC_CIPHER")) || cCode;
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


/**
 * rsaKeys generates a random public and private keypair.
 * Take note of these pairs for rsaEncode(MC_RSA_PUBLIC_KEY) and rsaDecode(MC_RSA_PRIVATE_KEY) functions.
 * @return Array<number>
 */
export const rsaKeys = (): Array<Array<number>> => {
    return RSA.KeyGenerator()
}

/**
 * rsaEncode function encrypts file(currently JSON), with the specified MC_RSA_PUBLIC_KEY environment variable.
 * MC_RSA_PUBLIC_KEY must be of type Array<number>, eg. [5, 1000].
 * Writes the encoded content (filePath) to the encodedFilePath
 * @param filePath - input file path to be encoded
 * @param encodedFilePath - file path to write the encoded file content
 * @param publicKey - this is the public key to encode the specified filePath content
 */
export const rsaEncode = (filePath: string, encodedFilePath: string, publicKey: Array<number> = []) => {
    try {
        const pubKey = Deno.env.get("MC_RSA_PUBLIC_KEY");
        const rsaPublicKey: Array<number> = pubKey? JSON.parse(pubKey) : publicKey
        if (!rsaPublicKey || rsaPublicKey.length < 2) {
            console.error(`\nValid environment variable MC_RSA_PUBLIC_KEY, of type Array of numbers, is required\n`);
            Deno.exit(1);
        }
        // read file
        const rsaEncText = Deno.readTextFileSync(filePath)
        // perform encryption
        const rsaEncoded = RSA.Encoding(rsaEncText, rsaPublicKey)
        // store/write the encoded file content to file
        Deno.writeTextFileSync(encodedFilePath, JSON.stringify(rsaEncoded))
        console.log("\nEncryption completed successfully and written to: ", encodedFilePath);
    } catch (e) {
        console.error("encryption-error: ", e);
        throw e;
    }
}

/**
 * rsaDecode function decrypts encrypted file(currently JSON), with the specified MC_RSA_PRIVATE_KEY environment variable.
 * MC_RSA_PRIVATE_KEY must be of type Array<number>, eg. [9, 1999] and must match the MC_RSA_PUBLIC_KEY specified for the file encryption.
 * @param encodedFilePath - file path to write the encoded file content
 * @param privateKey - this is the private key to decode the encoded file content
 */
export const rsaDecode = (encodedFilePath: string, privateKey: Array<number> = []): ObjectType => {
    try {
        const privKey = Deno.env.get("MC_RSA_PRIVATE_KEY");
        const rsaPrivateKey: Array<number> = privKey? JSON.parse(privKey) : privateKey
        if (!rsaPrivateKey || rsaPrivateKey.length < 2) {
            console.error(`\nValid environment variable MC_RSA_PRIVATE_KEY, of type Array of numbers, is required\n`);
            Deno.exit(1);
        }
        // read the encodedText from file
        const rsaEncodedList = JSON.parse(Deno.readTextFileSync(encodedFilePath))
        // perform decryption
        const rsaDecoded = RSA.Decoding(rsaEncodedList, rsaPrivateKey)
        console.log("\nDecryption completed successfully for: ", encodedFilePath);
        return JSON.parse(rsaDecoded);
    } catch (e) {
        console.error("decryption-error: ", e);
        throw e;
    }

}
