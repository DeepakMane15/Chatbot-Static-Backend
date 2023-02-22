const { poolPromise } = require('../classes/dbConnection')
const { logger } = require('../classes/logger')
const { myCache } = require('../classes/cache');

const process = "ActionFlag"
const BusinessConfigurations = async (req, res) => {
    try {
        // console.log(req.body);
        logger.log({
            level: 'info',
            message: JSON.stringify(req.body)
        })
        if (myCache.get(process) && req.body.fromCache) {
            let filtered = myCache.get(process).filter(d => d.bid == req.body.bid);
            return res.send({
                status: (filtered && filtered.length > 0) ? 200 : 201,
                data: filtered, source: process
            })
        } else {
            const pool = await poolPromise
            const request = await pool.request();

            if (req.body.actionFlag == 'FETCH') {
                const query = `EXEC CHATBOT_BusinessConfigurations @ACTIONFLAG = 'FETCH', @bid=${req.body.bid}`
                // 
                console.log(query)
                let response = request.query(query, function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.send({ status: 400, data: err, source: process })
                    }
                    myCache.set(process, result.recordsets[0]);
                    let filtered = result.recordsets[0].filter(d => d.bid == req.body.bid);
                    return res.send({
                        status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                        data: filtered, source: process
                    })
                })
            }
            else if(req.body.actionFlag == 'UPDATE'){
                let query = `EXEC CHATBOT_BusinessConfigurations @ACTIONFLAG = 'UPDATE',@bid=${req.body.bid},@configurationName = '${req.body.configurationName}', @configurationValue = '${req.body.configurationValue}', @status=${req.body.status}, @id=${req.body.id}`
                // console.log(query)
                let response = request.query(query, function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.send({ status: 400, data: err, source: process })
                    }
                    else {
                        return res.send({ status: 200, data: "updated successfully", source: process })

                    }
                })

            } 
            else {
                let query = `EXEC CHATBOT_BusinessConfigurations @ACTIONFLAG = 'ADD',@bid=${req.body.bid},@configurationName = '${req.body.configurationName}', @configurationValue = '${req.body.configurationValue}'`
                // console.log(query)
                let response = request.query(query, function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.send({ status: 400, data: err, source: process })
                    }
                    else {
                        return res.send({ status: 200, data: "inserted successfully", source: process })

                    }
                })
            }


        }
    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}



module.exports = { BusinessConfigurations }