const mssql = require('mssql/msnodesqlv8');

var config = {
    database : "chatbot",
    server : "LAPTOP-AR1H4E0R\\SQLEXPRESS",
    driver:"msnodesqlv8",
    options:{
        trustedConnection:true
    }
};


const poolPromise = new mssql.ConnectionPool(config)
.connect()
.then(pool => {
  console.log("Connected to MSSQL")
  return pool
})
.catch(err => console.log("Err : ", err))

module.exports = {mssql, poolPromise}