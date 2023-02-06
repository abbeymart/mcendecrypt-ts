import { RSA } from "./deps.ts";

const filePath = "./config.test.json";
const encodedFilePath = "./config.test.rsa";

// RSA.KeyGenerator (generates a random public and private keypair)
const rsaKeys = RSA.KeyGenerator()
console.log(rsaKeys) // [[3,1219],[763,1219]]

const rsaEncText = Deno.readTextFileSync(filePath)
const rsaPublicKey = [5, 8633]
const rsaPrivateKey = [5069, 8633]

// RSA.Encoding
const rsaEncoded = RSA.Encoding(rsaEncText, rsaPublicKey)
console.log("ENCODED-VALUE")
console.log(rsaEncoded)
Deno.writeTextFileSync(encodedFilePath, JSON.stringify(rsaEncoded))
// const rsa_dec_list = [234,246,485,485,1132,1074,243,1132,459,485,420]
const rsaEncodedList = JSON.parse(Deno.readTextFileSync(encodedFilePath))
console.log("ENCODED-VALUE-FROM-FILE")
console.log(rsaEncodedList)

//RSA.Decoding
const rsaDecoded = RSA.Decoding(rsaEncodedList, rsaPrivateKey)
console.log("DECODED-VALUE")
console.log(rsaDecoded)
