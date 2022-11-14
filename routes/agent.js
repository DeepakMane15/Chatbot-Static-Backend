var express = require('express');
const { AgentLogin } = require('../controller/AgentLogin');
const { BusinessData } = require('../controller/BusinessData');
const { BusinessVerification } = require('../controller/BusinessVerification');
const { StaticAutoResponse } = require('../controller/StaticAutoResponse');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/AgentLogin', AgentLogin)
router.post('/BusinessData', BusinessData)
router.post('/BusinessVerification', BusinessVerification)
router.post('/StaticAutoResponse', StaticAutoResponse)

module.exports = router;
