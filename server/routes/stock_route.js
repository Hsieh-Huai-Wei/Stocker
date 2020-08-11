const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
  option,
  backTest,
  filterHistory,
  stock,
} = require('../controllers/stock_controller');

router.route('/option').get(wrapAsync(option));
router.route('/backTest').post(wrapAsync(backTest));
router.route('/filterHistory').post(wrapAsync(filterHistory));
router.route('/stock').get(wrapAsync(stock));

module.exports = router;
