const express = require("express");
const router = express.Router();
const est = require("../controllers/est");
const verify = require("../middleware/verify");
const multer = require("../multer.js");
 
router.post("/post", multer.single("file"), est.est);
router.post("/uploadimage/:id", multer.single("file"), est.uploadImage);
router.get("/:categoryId", est.get);
router.get("/estsuser/:estId", est.getEstsUser);
router.post("/rating", est.addStar);
router.post("/getrate", est.getRate);
router.patch("/uploadrate", est.ModifyRate);
router.get("/getEst/:estId", est.getEst);
router.get("/testeAll", est.testAll);
router.post("/teste", est.test);
router.post("/openClose", est.openClose);
router.post("/update/:estId", multer.array("files"), est.updateEst);
router.get("/delete/:estId", est.delete);
router.get("/", est.getAll);

router.get("/toprates", est.estTopRates);
router.post("/addopen/:id", est.addOpen);

module.exports = router;
