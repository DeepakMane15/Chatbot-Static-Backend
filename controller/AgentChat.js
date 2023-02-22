
const { poolPromise } = require('../classes/dbConnection')

const process = "AgentChat";
const AgentChat = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();
        // console.log(data)
        let data = req.body;

        const query = `EXEC CHATBOT_Messages_OLTP @ActionFlag = 'INSERT-AGENT-CHAT', @BID = ${data.bid},  
    @TYPE = '${data.type}', @RESPONSE = '${data.response}',@BUTTONVALUES = '[{}]',
    @FROM = '${req.body.from}', @CUSTOMERID = '${data.customerId}',@AGENTID = '${data.agentId}'`

        console.log(query);
        request.query(query, function (err, result) {

            if (err) {
                console.log(err)
                return res.send({ status: 400, data: err, source: process })

            }
            return res.send({ status: 200, data: "Messages Inserted Successfully", source: process })

        })
    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}
module.exports = { AgentChat };

