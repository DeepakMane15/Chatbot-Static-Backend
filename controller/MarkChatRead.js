const { poolPromise } = require('../classes/dbConnection')

const process = "MarkChatRead";
const MarkChatRead = async (req, res) => {
    try {
        console.log(process)
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_Chats @ACTIONFLAG='MARKREAD', @CUSTOMERID='${req.body.CustomerId}'`;
        console.log(query)
        request.query(query, function (err, result) {

            if (err) {
                console.log(err)
                return 0;
            }
            return res.send({
                status: 200 ,
                data: "Chat Marked Read", source: process
            })
        })
    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}
module.exports = { MarkChatRead };