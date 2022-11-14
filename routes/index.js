const e = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */

const agentRoutes = require('./agent')
const userRoutes = require('./user')

router.use('/agent',agentRoutes);
router.use('/users',userRoutes)

module.exports = router;


