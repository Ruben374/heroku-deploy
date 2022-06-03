const express = require("express");
const router = express.Router();
const services = require("../controllers/services");

router.post("/post", services.post);
router.get("/service/:id/appointments", services.getAppointments);
router.get("/service/:id", services.get);
router.get("/services/:id", services.getService);
router.put("/update/:id", services.UpdateService);
router.delete("/delete/:id", services.DeleteService);
module.exports = router; 
