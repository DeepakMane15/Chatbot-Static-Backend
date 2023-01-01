var express = require('express');
const { AgentLogin } = require('../controller/AgentLogin');
const { BusinessData } = require('../controller/BusinessData');
const { BusinessVerification } = require('../controller/BusinessVerification');
const { ChatEnd } = require('../controller/ChatEnd');
const { GetChats } = require('../controller/GetChats');
const { MarkChatRead } = require('../controller/MarkChatRead');
const { SendEmail } = require('../controller/SendEmail');
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
router.post('/ChatEnd', ChatEnd)
router.post('/SendEmail', SendEmail)
router.post('/GetChats',GetChats )
router.post('/MarkChatRead',MarkChatRead )





module.exports = router;
