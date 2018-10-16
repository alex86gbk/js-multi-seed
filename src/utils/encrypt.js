import * as CryptoJS from 'crypto-js';

const encrypt = {
  /**
   * TripleDES 加密
   * @param {String} message 待加密字符串
   * @param {String} key 秘钥
   * @return {string}
   */
  encryptByTripleDES(message, key) {
    const encrypted = CryptoJS.TripleDES.encrypt(
      CryptoJS.enc.Utf8.parse(message),
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: CryptoJS.enc.Utf8.parse('ruanyun*'),
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });

    return encrypted.toString();
  },
  /**
   * MD5 加密
   * @param {String} message 待加密字符串
   */
  encryptByMD5(message) {
    return CryptoJS.MD5(message).toString();
  },
};

export default encrypt;
