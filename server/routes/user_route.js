const router = require("express").Router();
const { wrapAsync } = require("../../util/util");

const {
  signin,
  signup,
  profile,
} = require("../controllers/user_controller");

router.route("/user/signin").post(wrapAsync(signin));
router.route("/user/signup").post(wrapAsync(signup));
router.route("/user/profile").post(wrapAsync(profile));

module.exports = router;