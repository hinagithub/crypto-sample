'use strict'
const express = require('express')
const cookieParser = require('cookie-parser')
const { encode, decode } = require('url-safe-base64')
const crypto = require('crypto')
const moment = require('moment')

const KEY = '12345abcde12345abcde12345abcde12' // 32Byte
const IV = '12345abcde12345a' // 16Byte
const ALG = 'aes256'
const ENCODING = 'base64'

const app = express()

/**
 * サーバ起動
 */
app.use(cookieParser())
const server = app.listen(3000, function () {
  console.log('🚀 app started. port:' + server.address().port)
})

/**
 * encryptする
 */
app.get('/encrypt', async function (req, res, next) {
  const text = req.query.text
  res.send(encrypt(text))
})

/**
 * encryptする
 */
app.get('/encrypt-safe', async function (req, res, next) {
  const text = req.query.text
  const result = await encryptWithBase64UrlSafe(text)
  res.send(result)
})

/**
 * decryptする
 */
app.get('/decrypt', async function (req, res, next) {
  const encrypted_text = req.query.encrypted_text
  res.send(decrypt(encrypted_text))
})

/**
 * トークン発行
 */
app.get('/authorize', async function (req, res, next) {
  const payload = { user_id: req.query.user_id }
  const token = await encryptWithBase64UrlSafe(JSON.stringify(payload))
  res.cookie('my_token ', token, {
    expires: moment()
      .add(5, 'minutes')
      .toDate()
  })
  res.send(token)
})

/**
 * トークン検証
 */
app.get('/verify', async function (req, res, next) {
  const token = req.cookies.my_token
  const decrypted = await decryptWithBase64UrlSafe(token)
  const decoded = JSON.parse(decrypted)
  res.json({ user_id: decoded.user_id })
})

/**
 *暗号化
 */
const encrypt = text => {
  const cipher = crypto.createCipheriv(ALG, Buffer.from(KEY), Buffer.from(IV))
  let encryptedText = cipher.update(text, 'utf8', ENCODING)
  encryptedText += cipher.final(ENCODING)
  return encryptedText
}

/**
 *複合
 */
const decrypt = encryptedText => {
  const decipher = crypto.createDecipheriv(
    ALG,
    Buffer.from(KEY),
    Buffer.from(IV)
  )
  let decryptedText = decipher.update(encryptedText, ENCODING, 'utf8')

  decryptedText += decipher.final('utf8')
  return decryptedText
}

/**
 * 暗号化 + base64で包む
 */
const encryptWithBase64UrlSafe = async x => {
  const encrypted = encrypt(x)
  return encode(encrypted)
}

/**
 * base64のデコード + 複合
 */
const decryptWithBase64UrlSafe = async x => {
  const decoded = decode(x)
  return decrypt(decoded)
}
