<<<<<<< HEAD
const express = require('express')
const router = express.Router();
const services = require('../controllers/services')

router.post('/post', services.post)
router.get('/:id', services.get)
router.get('/serv/:id', services.getService)
router.put('/update/:id', services.UpdateService)
router.delete('/delete/:id', services.DeleteService)
module.exports = router
=======
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
>>>>>>> 9bb0ee888caecc12b17c8a06660502c3b0885f6c
