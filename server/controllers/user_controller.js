const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = 'secret';
const validator = require('validator');
const User = require('../models/user_model');
const Product = require('../models/stock_model');

const signUp = async (req, res) => {
  const expirationDate = Math.floor(Date.now() / 1000) + 3600;
  const signInDate = Math.floor(Date.now() / 1000);
  if (!req.body.name || !req.body.email) {
    res.status(400).send({ error: '使用者名稱或信箱不得為空!' });
    return;
  } else if (!req.body.pwd || req.body.pwd.length < 6) {
    res.status(400).send({ error: '密碼不得為空或長度小於6位數!' });
    return;
  } else if (!validator.isEmail(req.body.email)) {
    res.status(400).send({ error: '信箱格式錯誤!' });
      return;
  } else {
    let data = {
      name: req.body.name,
      email: req.body.email,
      pwd: req.body.pwd,
    };

    let checkAccount = await User.signUpCheck(data);

    if (checkAccount.length > 0) {
      res.status(400).send({ error: '帳號已存在!' });
      return;
    } else {
      const randomID = Math.floor(Math.random() * 10000) + 1;
      const userPwd = crypto
        .createHash('sha256')
        .update(req.body.pwd)
        .digest('hex');

      const token = jwt.sign(
        { userEmail: req.body.email, exp: expirationDate },
        secret
      );

      let userData = {
        id: randomID,
        name: req.body.name,
        email: req.body.email,
        pwd: userPwd,
        pic: '123.jpeg',
        provider: 1,
        token: token,
        date: signInDate,
      };

      await User.signUp(userData);
      let user = {
        id: randomID,
        provider: 'native',
        name: req.body.name,
        email: req.body.email,
        picture: '123.jepg',
      };

      data = {};
      data.access_token = token;
      data.access_expired = signInDate;
      data.user = user;
      let results = {};
      results.data = data;
      res.status(200).json(results);
    }
  }
};

const signIn = async (req, res) => {
  const expirationDate = Math.floor(Date.now() / 1000) + 3600; // 60 min
  const signInDate = Math.floor(Date.now() / 1000);
  if (!req.body.email || !req.body.pwd || req.body.pwd.length < 6) {
    res.status(400).send({ error: '信箱與密碼不可為空!，且密碼長度不得小於6位數!' });
    return;
  } else {
    const userPwd = crypto
      .createHash('sha256')
      .update(req.body.pwd)
      .digest('hex');

    let data = {
      email: req.body.email,
      pwd: userPwd,
    };

    let checkAccount = await User.signInCheck(data);
    if (checkAccount.length === 0) {
      res.status(403).send({ error: '信箱不存在或密碼錯誤!' });
    } else {
      const token = jwt.sign(
        { userEmail: req.body.email, exp: expirationDate },
        secret
      );

      data = {
        email: req.body.email,
        date: signInDate,
        pwd: userPwd,
        token: token,
      };
      await User.signInUpdate(data);
      let getUserInfor = await User.signIn(data);
      let user = getUserInfor[0];
      data = {};
      data.access_token = token;
      data.access_expired = signInDate;
      data.user = user;
      let results = {};
      results.data = data;
      res.status(200).json(results);
    }
  }
};

const getProfile = async (req, res) => {
  try {
    // const signInDate = Math.floor(Date.now() / 1000);
    let decode = jwt.verify(req.body.token, secret);
    // if (decode.exp > signInDate) {
      let data = {
        email: decode.userEmail,
        token: req.body.token,
      };
      let result = await User.profile(data);
      if (result.length === 0) {
        res.status(400).json({ error: '用戶不存在!' });
        return;
      } else {
        res.status(200).json(result[0]);
      }
    // } else {
      // res.status(400).json({ error: '登入逾時，請重新登入!' });
    // }
  } catch (e) {
    res.status(403).json({ error: '登入逾時，請重新登入!' });
  }

};

const graphView = async (req, res) => {
  let token = (req.headers.authorization).split(' ')[1];
  let decode = jwt.verify(token, secret);
  let data = {
    email: decode.userEmail,
    token: req.body.token,
  };
  let result = await Product.filterHistory(data);
  res.status(200).json(result);
};

const backTestView = async (req, res) => {
  let token = (req.headers.authorization).split(' ')[1];
  let decode = jwt.verify(token, secret);
  let data = {
    email: decode.userEmail,
    token: req.body.token,
  };
  let result = await Product.backTestHistory(data);
  res.status(200).json(result);
};


module.exports = {
  signUp,
  signIn,
  getProfile,
  graphView,
  backTestView,
};