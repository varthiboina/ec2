const express = require('express');

//Controller 
const controller = require('../controller/ec2-controller');

const router = express.Router();

router.post('/create-instance', controller.createInstance);

module.exports = router;