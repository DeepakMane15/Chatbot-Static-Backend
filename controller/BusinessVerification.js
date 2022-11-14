const { poolPromise } = require('../classes/dbConnection')
const { logger } = require('../classes/logger')
const { myCache } = require('../classes/cache');

const process = "BusinessVerification"
const BusinessVerification = async (req, res) => {
    try {

        console.log(req.body);
        logger.log({
            level: 'info',
            message: JSON.stringify(req.body)
        })
        if (!myCache.get('businesses')) {
            const pool = await poolPromise
            const request = await pool.request();

            const query = `EXEC CHATBOT_Businesses`

            let response = request.query(query, function (err, result) {
                // console.log(result.recordsets[0], "verifff");
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: process })
                }
                myCache.set('businesses', result.recordsets[0])
                const d = result.recordsets[0].filter(d=> d.id == req.body.bid);
                return res.send({
                    status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                    data: d, source: process, cache:false
                })
            })
        } else {
            const d = myCache.get('businesses').filter(d=> d.id == req.body.bid);
            return res.send({
                status:  200,
                data: d, source: process, cache:true
            })
        }


    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}



module.exports = { BusinessVerification }