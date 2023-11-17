const jsonwebtoken = require('jsonwebtoken')
// const {send} = require('express/lib/response')

function auth (req,res,next){
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send({message: "Access denied"})
    }
    try{
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        req.user = verified;

        next() // call next as there is no return
    }catch(err){ // 403 as they have token but no longer valid
        return res.status(403).send({message: 'Invalid token'})
    }
}

module.exports = auth