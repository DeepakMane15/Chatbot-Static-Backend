const { poolPromise } = require('../classes/dbConnection')
const jwt = require('jsonwebtoken');
const path = require('path')
require('dotenv').config()
const processName = "Agent"

const Agent = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();
        if (req.body.ActionFlag == 'LOGIN') {
            const query = `EXEC CHATBOT_Agent @ActionFlag = 'LOGIN', @Username = '${req.body.username}',
         @Password = '${req.body.password}'`
            console.log(query)
            request.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: processName })
                }
                AgentLoggedIn(result.recordsets[0][0].id);
                let token;
                if (result && result.recordsets[0].length > 0) {
                    token = jwt.sign({
                        id: result.recordsets[0][0].id, name: result.recordsets[0][0].firstName + " " + result.recordsets[0][0].lastName,
                        bid: result.recordsets[0][0].bid, role: result.recordsets[0][0].role
                    }, process.env.SECRETKEY, { expiresIn: 60 * 60 });
                }

                return res.send({
                    status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                    data: result.recordsets[0], message: (result && result.recordsets[0].length > 0) ? "Logged in" : "Invalid Username or Password",
                    token: token,
                    source: processName
                })
            })
        } else if (req.body.ActionFlag == 'FETCH') {
            const query = `EXEC CHATBOT_Agent @ActionFlag = 'FETCH', @bid = '${req.body.bid}'`
            console.log(query)
            request.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: processName })
                }
                return res.send({
                    status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                    data: result.recordsets[0], source: processName
                })
            })
        } else if (req.body.ActionFlag == 'ADD') {
            const query = `EXEC CHATBOT_Agent @ActionFlag = 'ADD', @bid = '${req.body.bid}',@firstName = '${req.body.firstName}',
            @lastName  = '${req.body.lastName}', @Username  = '${req.body.userName}', @Password  = '${req.body.password}', @role = '${req.body.role}'`
            console.log(query)
            request.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: processName })
                }
                return res.send({
                    status: 200,
                    data: "Agent added", source: processName
                })
            })
        }


    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: processName })
    }
}

const AgentLoggedIn = async(data) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();
        const query = `EXEC CHATBOT_Agent @ActionFlag = 'LOGGEDIN', @id = '${data}'`
        console.log(query)
        request.query(query, function (err, result) {
            if (err) {
                console.log(err)
                return ({ status: 400, data: err, source: processName })
            }

            return ({
                status: 201,
                data: "logged in",
                source: processName
            })
        })
    }
    catch (err) {
        console.log(err)
        return ({ status: 400, data: err, source: processName })
    }
}


module.exports = { Agent }