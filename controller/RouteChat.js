const { poolPromise } = require('../classes/dbConnection')

const process = "RouteChat";
const RouteChat = async (req, res) => {
    try {
        console.log("RouteChat")
        const pool = await poolPromise
        const request = await pool.request();

        if (req.body.ActionFlag == 'ADD') {

            // const AgentId = await AgentAllocation({ bid: req.body.bid }).then()
            // console.log(AgentId)
            const query1 = `EXEC CHATBOT_Interactions @ActionFlag = 'ALLOCATION', @bid = ${req.body.bid}`
            // console.log(query1)
            await request.query(query1, function (err, result1) {
                if (err) {
                    console.log(err)
                    return ({ status: 400, data: err, source: process })
                }
                else {
                    if (result1 && result1.recordsets[0].length > 0) {
                        let agent = result1.recordsets[0][0];
                        var type;
                        var number
                        if(agent.capacity == agent.occupancy){
                            type='waiting';
                            number = agent.waiting + 1;
                        } else{
                            type="occupancy";
                            number = agent.occupancy + 1;
                        }
                        // console.log(result1.recordsets[0])
                        const query = `EXEC CHATBOT_Interactions @ActionFlag='ADD', @bid=${req.body.bid}, @customerId= '${req.body.customerId}', @agent = ${result1.recordsets[0][0].id},@status='waiting', @type='${type}',@number=${number},@currentChats = ${agent.currentChats + 1}`;
                        // console.log(query)
                        request.query(query, function (err, result) {

                            if (err) {
                                console.log(err)
                                return 0;
                            }
                            return res.send({
                                status: 200,
                                data: 'Inserted successfully', source: process
                            })
                        })
                    }
                }
            })

        }

    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}

const AgentAllocation = async (data) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_Agent @ActionFlag = 'ALLOCATION', @bid = ${data.bid}`
        // console.log(query)
        let response = await request.query(query, function (err, result) {
            if (err) {
                console.log(err)
                return ({ status: 400, data: err, source: process })
            }
            return ({
                status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                data: result.recordsets[0], source: process
            })
        })
        return response
    }
    catch (err) {
        console.log(err)
        return ({ status: 400, data: err, source: process })
    }
}



module.exports = { RouteChat };