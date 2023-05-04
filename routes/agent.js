var express = require('express');
const { AgentChat } = require('../controller/AgentChat');
const { Agent } = require('../controller/Agent');
const { BusinessConfigurations } = require('../controller/BusinessConfigurations');
const { BusinessData } = require('../controller/BusinessData');
const { BusinessVerification } = require('../controller/BusinessVerification');
const { EndChat, EndChatByAgent } = require('../controller/EndChat');
const { GetChats } = require('../controller/GetChats');
const { Interactions } = require('../controller/Interactions');
const { MarkChatRead } = require('../controller/MarkChatRead');
const { RouteChat } = require('../controller/RouteChat');
const { SendEmail } = require('../controller/SendEmail');
const { StaticAutoResponse } = require('../controller/StaticAutoResponse');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/Agent', Agent)
router.post('/BusinessData', BusinessData)
router.post('/BusinessVerification', BusinessVerification)
router.post('/StaticAutoResponse', StaticAutoResponse)
router.post('/EndChat', EndChat)
router.post('/EndChatByAgent', EndChatByAgent)
router.post('/SendEmail', SendEmail)
router.post('/GetChats',GetChats )
router.post('/MarkChatRead',MarkChatRead )
router.post('/BusinessConfigurations',BusinessConfigurations )
router.post('/RouteChat',RouteChat )
router.post('/Interactions',Interactions )
router.post('/AgentChat', AgentChat )







module.exports = router;
