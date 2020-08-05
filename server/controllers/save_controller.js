const Save = require('../models/save_model');
const jwt = require('jsonwebtoken');
const secret = 'secret';
const User = require('../models/user_model');

const filter = async (req, res, next) => {
  try {
    let userToken = req.body.user;
    let decode = jwt.verify(userToken, secret);
    let userData = {
      email: decode.userEmail,
      token: userToken,
    };
    let userResult = await User.profiles(userData);
    let num = req.body.data.length;
    for (let i = 0; i < num; i++) {
      let data = {
        user_id: parseInt(userResult[0].id),
        stock_code: req.body.data[i].id,
        trend: JSON.stringify(req.body.data[i].trend),
        start: req.body.inf.start,
        end: req.body.inf.end,
        upper: req.body.inf.upper,
        lower: req.body.inf.lower,
        graph: req.body.inf.graph,
        count: req.body.inf.count,
      };
      await Save.filter(data);
      res.status(200).send({});
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: '儲存失敗' });
  }
};

const backTest = async (req, res, next) => {
  console.log(req.body);
};

module.exports = {
  filter,
  backTest,
};
