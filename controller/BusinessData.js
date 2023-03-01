const { poolPromise } = require('../classes/dbConnection')
const { logger } = require('../classes/logger')
const {myCache} = require('../classes/cache');

const process = "BusinessData"
const BusinessData = async (req, res) => {
    try {
        // console.log(req.body);
        logger.log({
            level: 'info',
            message: JSON.stringify(req.body)
        })
        const pool = await poolPromise
        const request = await pool.request();

        const query = `EXEC CHATBOT_StartupMessages @ActionFlag = 'FETCH', @BID = '${req.body.bid}'`
        console.log(query)
        let response = request.query(query, function (err, result) {
            // console.log(result.recordsets[0]);
            if (err) {
                console.log(err)
                return res.send({ status: 400, data: err, source: process })
            }
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



module.exports = { BusinessData }