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
    let userResult = await User.profile(userData);
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
        increase: req.body.inf.increase,
        decrease: req.body.inf.decrease,
      };
      await Save.filter(data);
      res.status(200).send({});
    }
  } catch (e) {
    res.status(404).json({ error: '儲存失敗' });
  }
};

const backTest = async (req, res, next) => {
  try {
    let userToken = req.body.user;
    let decode = jwt.verify(userToken, secret);
    let userData = {
      email: decode.userEmail,
      token: userToken,
    };
    let userResult = await User.profile(userData);
    let num = req.body.data.length;
    for (let i = 0; i < num; i++) {
      let summary = {
        user_id: userResult[0].id,
        stock_code: parseInt(req.body.data[i].condition.code),
        property: req.body.data[i].condition.property,
        discount: req.body.data[i].condition.discount,
        decrease: req.body.data[i].condition.decrease,
        decrease_action: req.body.data[i].condition.decreaseAct,
        decrease_count: req.body.data[i].condition.decreaseCount,
        increase: req.body.data[i].condition.increase,
        increase_action: req.body.data[i].condition.increaseAct,
        increase_count: req.body.data[i].condition.increaseCount,
        start: parseInt(req.body.data[i].condition.startDate),
        end: parseInt(req.body.data[i].condition.endDate),
        stock_inventory: parseInt(req.body.data[i].summary.finalStock),
        stock_price: parseFloat(req.body.data[i].summary.stockValue),
        trade_cost: parseFloat(req.body.data[i].summary.tradeCost),
        final_property: parseFloat(req.body.data[i].summary.totalAssets),
        profit: parseFloat(req.body.data[i].summary.income),
        roi: parseFloat(req.body.data[i].summary.earningRate),
      };
      await Save.summary(summary);
    }
    res.status(200).send({});
  } catch (e) {
    res.status(404).json({ error: '儲存失敗' });
  }
};

module.exports = {
  filter,
  backTest,
};
