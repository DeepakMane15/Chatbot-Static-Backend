const { poolPromise } = require('../classes/dbConnection')

const process = "GetChats";
const GetChats = async (req, res) => {
    try {
        console.log(process)
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_Chats @ACTIONFLAG='FETCHCHATS', @bid=${req.body.bid}`;

        request.query(query, function (err, result) {

            if (err) {
                console.log(err)
                return 0;
            }
            let grouped = {}
            result.recordsets[0].forEach(function (a) {
                grouped[a.customerid] = grouped[a.customerid] || [];
                grouped[a.customerid].push(a);
            });
            var chatlists = Object.keys(grouped).map(index => {
                let person = grouped[index];
                return person;
        
            });
            chatlists = chatlists.reverse();
            return res.send({
                status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                data: chatlists, source: process
            })
        })
    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}
module.exports = { GetChats };