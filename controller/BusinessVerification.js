const { poolPromise } = require('../classes/dbConnection')
const { logger } = require('../classes/logger')
const { myCache } = require('../classes/cache');

const process = "BusinessVerification"
const BusinessVerification = async (req, res) => {
    try {

        logger.log({
            level: 'info',
            message: JSON.stringify(req.body)
        })

        const pool = await poolPromise
        const request = await pool.request();

        if (req.body.ActionFlag == 'FETCH') {
            if (!myCache.get('businesses') || ('cacheEnabled' in req.body && !req.body.cacheEnabled)) {

                const query = `EXEC CHATBOT_Businesses @ActionFlag='FETCH'`

                let response = request.query(query, function (err, result) {
                    // console.log(result.recordsets[0], "verifff");
                    if (err) {
                        console.log(err)
                        return res.send({ status: 400, data: err, source: process })
                    }
                    myCache.set('businesses', result.recordsets[0])
                    let d = result.recordsets[0];
                    if (req.body.Action == "VerifyBusiness") {
                        d = d.filter(d => d.id == req.body.bid);
                    }

                    return res.send({
                        status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                        data: d, source: process, cache: false
                    })
                })
            } else {
                let d = myCache.get('businesses');
                if (req.body.Action == "VerifyBusiness") {
                    d = d.filter(d => d.id == req.body.bid);
                }

                return res.send({
                    status: 200,
                    data: d, source: process, cache: true
                })
            }
        }
        else if (req.body.ActionFlag == 'ADD') {
            const business = req.body.business;
            const agent = req.body.agent;
            const configuration = req.body.configuration;
            const startupMessage = req.body.startupMessage;
            const query = `EXEC CHATBOT_Businesses @ActionFlag='ADD',@name='${business.clientName}',@location='${business.location}',@businessType='${business.businessType}',@chatbotType='${business.chatbotType}',@agentSupport='${business.agentSupport}',
            @firstName ='${agent.rootName}',@username ='${agent.rootUsername}',@password ='${agent.rootPassword}',@noResponseTimeout ='${configuration.NoResponseTimeout}', @timeoutMessage ='${configuration.NoResponseTimeoutMessage}', @inputParameters ='${configuration.InputParameters}', @routeMessage ='${configuration.RouteMessage}', @agentJoinMessage='${configuration.AgentJoinMessage}', @message ='${startupMessage.message}',
            @message1 ='${startupMessage.node2Message}',
            @hasButtons ='${startupMessage.hasButtons}',
            @buttonValues ='${startupMessage.buttonValues}',
            @buttonValues2 ='${startupMessage.buttonValues2}',
            @keyboardInput ='${startupMessage.keyboardInput}', 
            @expectedInput ='${startupMessage.expectedInput}', 
            @defaultResponse ='${startupMessage.defaultResponse}'
`

            console.log(query)

            let response = request.query(query, function (err, result) {
                // console.log(result.recordsets[0], "verifff");
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: process })
                }
                else {
                    return res.send({
                        status: 200,
                        data: "client added", source: process
                    })
                }
            })
        }





    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}



module.exports = { BusinessVerification }