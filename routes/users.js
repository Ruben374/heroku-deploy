const express = require("express");
const router = express.Router();
const user = require("../controllers/users");
router.post("/signUp", user.SignUpUser);
router.post("/login", user.Login);
router.post("/confirmCode", user.VerifyConfirmationCode);
router.post("/resetPassword/reset", user.VerifyReconConfirmationCode);
router.post("/validateToken", user.RefreshToken);
router.post("/confirmCode/reset", user.confirmcodereset);
router.post("/verifyEmail", user.VerifyEmail);
router.post("/resetPassword", user.resertPassword);
router.post("/resetUserPassword", user.resertUserPassword)
router.get("/establishment/:id", user.get);
module.exports = router;
