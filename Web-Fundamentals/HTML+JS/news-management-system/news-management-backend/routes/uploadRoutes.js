const express = require('express');
const qiniu = require('qiniu');
const router = express.Router();

// 引入你的七牛云配置
const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;
const bucket = process.env.QINIU_BUCKET;
const domain = process.env.QINIU_DOMAIN;

// 配置七牛云认证
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 生成上传凭证
router.get('/token', (req, res) => {
  const options = {
    scope: bucket,

    expires: 36000000, // token有效期，单位：秒
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  console.log("获得的凭证=", uploadToken)
  res.json({ token: uploadToken, domain: domain });
});

module.exports = router;