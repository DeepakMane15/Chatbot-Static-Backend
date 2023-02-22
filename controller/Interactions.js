const { poolPromise } = require('../classes/dbConnection')

const process = "Interactions";
const Interactions = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();
        if (req.body.ActionFlag == 'GET') {

            const query = `EXEC CHATBOT_Interactions @ActionFlag='GET', @bid=${req.body.bid}, @agent=${req.body.agentId}`;
            console.log(query)
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

        } else if (req.body.ActionFlag == 'ACCEPT-CHAT') {
            const query = `EXEC CHATBOT_Interactions @ActionFlag='ACCEPT-CHAT', @interactionId=${req.body.id}`;
            console.log(query)
            request.query(query, function (err, result) {

                if (err) {
                    console.log(err)
                    return 0;
                }

                return res.send({
                    status: 200,
                    data: 'Chat Accepted Successfully', source: process
                })
            })
        }

    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}
module.exports = { Interactions };