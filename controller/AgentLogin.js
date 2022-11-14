const {poolPromise} = require('../classes/dbConnection')

const process = "AgentLogin"
const AgentLogin = async (req,res) => {
    try{
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_AgentDetails @ActionFlag = 'LOGIN', @Username = '${req.body.username}',
         @Password = '${req.body.password}'`

         let response = request.query(query, function(err, result) {
            if(err){
                console.log(err)
                return res.send({status:400, data:err, source:process})
            }
            return res.send({ status:(result&&result.recordsets[0].length > 0) ? 200 : 201, 
                data:result.recordsets[0], message : (result&&result.recordsets[0].length > 0) ? "Logged in" : "Invalid Username or Password",
                 source:process})
         })
         return response
    }
    catch(err) {
        console.log(err)
        res.send({status:400, data:err, source:process})
    }
}

module.exports = {AgentLogin}