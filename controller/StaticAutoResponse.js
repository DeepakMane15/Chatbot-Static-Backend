const { poolPromise } = require('../classes/dbConnection')

const process = "StaticAutoResponse";
const StaticAutoResponse = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();

        console.log(req.body);

        if (req.body.ActionFlag == 'ADMIN-FETCH') {
            console.log("in here")
            const query = `EXEC CHATBOT_StaticAutoResponses @ActionFlag = '${req.body.ActionFlag}', @BID = ${req.body.bid}`
            // console.log(query)
            let response = request.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: process })
                }
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
        else if (req.body.ActionFlag == 'ADD-RESPONSES') {
            const query = `EXEC CHATBOT_StaticAutoResponses @ActionFlag = '${req.body.ActionFlag}', @BID = ${req.body.bid}, @SMID=${req.body.smid}, @RID = ${req.body.rid}, 
        @TYPE = '${req.body.type}', @RESPONSE = '${req.body.response}',@HASBUTTONS = ${req.body.hasButtons},@BUTTONVALUES = '${req.body.buttonValues}',@KEYBOARDINPUT = ${req.body.keyboardInput},
        @EXPECTEDINPUT ='${req.body.expectedInput}' ,
            @DEFAULTRESPONSE = '${req.body.defaultResponse}', @ENDCHAT = ${req.body.endChat}, @ATTRIBUTEVALUE =${req.body.attributeValue} 
        `
        console.log(query);

            let response = request.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: process })
                }
                // console.log(result.recordsets[0]);
                return res.send({
                    status:  200 ,
                    data: "responses added successfully", source: process
                })
            })
        }
        else {
            const query = `EXEC CHATBOT_StaticAutoResponses @ActionFlag = '${req.body.ActionFlag}', @BID = ${req.body.bid}, @AID='${req.body.aid}', @SMID=${req.body.smid}, @RID = ${req.body.rid}, 
        @TYPE = '${req.body.template.type}', @RESPONSE = '${req.body.response}',@IMG= '${req.body.template.img}',@HASBUTTONS = ${req.body.template.hasButtons},@BUTTONVALUES = '${req.body.template.buttonValues}',
        @FROM = '${req.body.from}', @CUSTOMERID = '${req.body.customerId}',@AGENTID = 0`

            console.log(query);

            let response = request.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ status: 400, data: err, source: process })
                }
                // console.log(result.recordsets[0]);
                
                if (result.recordsets[0][0] != undefined) {
                    let d = InsertBotResponse(result.recordsets[0][0], req.body.customerId, req.body.customerAttribute, req.body.attributeName, req.body.attributeValue);
                }
                return res.send({
                    status: (result && result.recordsets[0].length > 0) ? 200 : 201,
                    data: result.recordsets[0], source: process
                })
            })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, data: err, source: process })
    }
}

const InsertBotResponse = async (data, customerId, customerAttribute, attributeName, attributeValue) => {
    try {
        const pool = await poolPromise
        const request = await pool.request();
        console.log(data)

        const query1 = `EXEC CHATBOT_Messages_OLTP @ActionFlag = 'INSERT', @BID = ${data.bid} , @SMID=${data.smid}, @RID = ${data.rid}, 
    @TYPE = '${data.type}', @RESPONSE = '${data.response}',@IMG= '${data.img}',@HASBUTTONS = ${data.hasButtons},@BUTTONVALUES = '${data.buttonValues}',
    @FROM = 'bot', @CUSTOMERID = '${customerId}',@AGENTID = 0, @CUSTOMERATTRIBUTE='${customerAttribute}', @ATTRIBUTENAME = '${attributeName}', @ATTRIBUTEVALUE = '${attributeValue}'`

        console.log(query1);
        let response = request.query(query1, function (err, result1) {

            if (err) {
                console.log(err)
                return 0;
            }
            return 1;
        })
    }
    catch (err) {
        console.log(err)
        return 0;
    }

}


module.exports = { StaticAutoResponse }
