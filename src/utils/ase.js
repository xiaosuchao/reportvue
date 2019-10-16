
import CryptoJS from 'crypto-js'
export default {// 加密
  encrypt(word, keyStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: key, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding })
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  }

}
