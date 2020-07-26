const router = require("express").Router();
const { wrapAsync } = require("../../util/util");

const {
  singleStock,
  option,
  backTest,
  option2,
} = require("../controllers/stock_controller");

router.route("/singleStock").post(wrapAsync(singleStock));
router.route("/option").post(wrapAsync(option));
router.route("/backTest").post(wrapAsync(backTest));
router.route("/option2").post(wrapAsync(option2));

module.exports = router;
