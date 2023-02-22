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
            const query = `EXEC CHATBOT_Businesses @ActionFlag='ADD',@name='${business.clientName}',@location='${business.location}',@businessType='${business.businessType}',@chatbotType='${business.chatbotType}',@agentSupport='${business.agentSupport}',
            @firstName ='${configuration.rootName}',@username ='${configuration.rootUsername}',@password ='${configuration.rootPassword}',@noResponseTimeout ='${configuration.noResponseTimeout}', @timeoutMessage ='${configuration.timeoutMessage}', @inputParameters ='${configuration.inputParameters}', @routeMessage ='${configuration.routeMessage}', @agentJoinMessage='${configuration.agentJoinMessage}'
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