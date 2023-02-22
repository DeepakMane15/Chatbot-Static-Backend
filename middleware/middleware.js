const jwt = require('jsonwebtoken')

exports.requireSignin= (req, res,next) => {
    if(req.headers.authorization){ 
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token,process.env.JWT_SECRET);
        req.user = user;
        
        }
        else{
            return res.status(400).json({messsage: "Authorization required"})
        }
       
        next();
}

exports.agentMiddleware = (req,res,next) => {
    if(req.user.role !== 'agent'){
        return res.status(400).json({
            message: "agent access denied"
        })
        
    }
    next();
}