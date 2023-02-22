const {poolPromise} = require('../classes/dbConnection')
const jwt = require('jsonwebtoken');
const path = require('path')
require('dotenv').config()
const processName = "AgentAllocation"

const AgentAllocation = async (req,res) => {
    try{
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_Agent @ActionFlag = 'ALLOCATION', @bid = '${req.body.bid}'`
        console.log(query)
         let response = request.query(query, function(err, result) {
            if(err){
                console.log(err)
                return res.send({status:400, data:err, source:processName})
            }
            return res.send({ status:(result&&result.recordsets[0].length > 0) ? 200 : 201, 
                data:result.recordsets[0], source:processName})
         })
         return response
    }
    catch(err) {
        console.log(err)
        res.send({status:400, data:err, source:processName})
    }
}


module.exports = {AgentAllocation}