const { poolPromise } = require('../classes/dbConnection')

const process = "StaticAutoResponse";
const StaticAutoResponse = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();

        // console.log(req.body.response);

        const query = `EXEC CHATBOT_StaticAutoResponses @ActionFlag = 'FETCH', @BID = ${req.body.bid} , @SMID=${req.body.smid}, @RID = ${req.body.rid}, 
        @TYPE = '${req.body.template.type}', @RESPONSE = '${req.body.response}',@IMG= '${req.body.template.img}',@HASBUTTONS = ${req.body.template.hasButtons},@BUTTONVALUES = '${req.body.template.buttonValues}',
        @FROM = '${req.body.from}', @CUSTOMERID = '${req.body.customerId}',@AGENTID = 0`

        console.log(query);

        let response = request.query(query, function (err, result) {
            if (err) {
                console.log(err)
                return res.send({ status: 400, data: err, source: process })
            }
            // console.log(result.recordsets[0]);
            if (err) {
                console.log(err)
                return res.send({ status: 400, data: err, source: process })
            }
            let d = InsertBotResponse(result.recordsets[0][0],req.body.customerId);
            return res.send({
                status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                data: result.recordsets[0], source: process
            })
        })
    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}

const InsertBotResponse = async (data,customerId) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();
        // console.log(data)

        const query1 = `EXEC CHATBOT_Messages_OLTP @ActionFlag = 'INSERT', @BID = ${data.bid} , @SMID=${data.smid}, @RID = ${data.rid}, 
    @TYPE = '${data.type}', @RESPONSE = '${data.response}',@IMG= '${data.img}',@HASBUTTONS = ${data.hasButtons},@BUTTONVALUES = '${data.buttonValues}',
    @FROM = 'bot', @CUSTOMERID = '${customerId}',@AGENTID = 0`

    // console.log(query1);
        let response = request.query(query1, function (err, result1) {

            if (err) {
                console.log(err)
                return 0;
            }
            return 1;
        })
    }
    catch (err) {
        console.log(err)
        return 0;
    }

}
module.exports = { StaticAutoResponse }
