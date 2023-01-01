const { poolPromise } = require('../classes/dbConnection')

const process = "ChatEnd";
const ChatEnd = async (req, res) => {
    try {
        console.log(process)
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_Chats @ACTIONFLAG='ENDCHAT', @CUSTOMERID = '${req.body.CustomerId}'`

        request.query(query, function (err, result) {

            if (err) {
                console.log(err)
                return 0;
            }
            return res.send({
                status: 200,
                data: 'Chat ended successfully',
                source: process
            })
        })
    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}
module.exports = { ChatEnd };