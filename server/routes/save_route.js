const router = require("express").Router();
const { wrapAsync } = require("../../util/util");

const {
  filter,
  backTest,
} = require("../controllers/save_controller");

router.route("/saveFilter").post(wrapAsync(filter));
router.route("/saveBackTest").post(wrapAsync(backTest));

module.exports = router;
