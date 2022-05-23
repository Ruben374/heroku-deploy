const express = require("express");
const router = express.Router();
const est = require("../controllers/est");
const verify = require("../middleware/verify");
const multer = require("../multer.js");

router.post("/post", multer.single("file"), est.est);
router.post("/uploadimage/:id", multer.single("file"), est.uploadImage);
router.get("/:categoryId", est.get);
router.get("/estsuser/:userId", est.getEstsUser);
router.post("/rating", est.addStar);
router.post("/getrate", est.getRate);
router.put("/updaterate", est.ModifyRate);
router.post("/get", est.getEst);
router.get("/get/mobile/:id", est.getEstMobile);
router.put("/update/est/:estId", est.updateEst);
router.post("/delete", est.delete);
router.get("/", est.getAll);
router.get("/toprates", est.estTopRates);
router.post("/addopen/:id", est.addOpen);

module.exports = router;
