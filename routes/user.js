var express = require('express');
const { UserConversation } = require('../controller/UserConversation');
var router = express.Router();

/* GET users listing. */

router.post('/UserConversation', UserConversation)

module.exports = router;
