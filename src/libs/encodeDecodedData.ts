import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_SECRET_KEY;
const keyCrypto = CryptoJS.enc.Utf8.parse(secretKey);


const encodeData =  (data: object) => {
    const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(jsonString), keyCrypto,{
        iv:iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    const encryptedData = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const hash = CryptoJS.HmacSHA256(CryptoJS.enc.Base64.parse(encryptedData), keyCrypto).toString(CryptoJS.enc.Base64);
    return{
        dataBody: encryptedData,
        Hash: hash
    }
}

const decodeData = (data: {EncodedData: string, Hash: string}) => {
    const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
    const dataBytes: CryptoJS.lib.WordArray = CryptoJS.enc.Base64.parse(data.EncodedData);

    const computedHash = CryptoJS.HmacSHA256(dataBytes, keyCrypto).toString(CryptoJS.enc.Base64);
    if(computedHash !== data.Hash){
        return null;
    }
    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: dataBytes
    })
    const decrypted = CryptoJS.AES.decrypt( cipherParams,keyCrypto,{
        iv:iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    const decryptedData = CryptoJS.enc.Utf8.stringify(decrypted);
    return JSON.parse(decryptedData);
}
export {encodeData, decodeData}