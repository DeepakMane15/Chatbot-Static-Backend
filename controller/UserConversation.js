const { poolPromise } = require('../classes/dbConnection')

const process = "UserConversation";
const UserConversation = async (req, res) => {
    try {
        console.log(process)
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_Messages_OLTP @ActionFlag = 'FETCH', @CUSTOMERID = '${req.body.CustomerId}'`

        request.query(query, function (err, result) {

            if (err) {
                console.log(err)
                return 0;
            }
            console.log(result.recordsets[0])
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
module.exports = {UserConversation};