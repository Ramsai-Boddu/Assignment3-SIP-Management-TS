const  jwt = require("jsonwebtoken")
const secret = "asdfghjkledcrfvtghn"

function signJwt(payload) {
    try {
        const token = jwt.sign(payload,secret,{
            expiresIn: "30m"
        })
        return token
    } catch (error) {
        console.log(error)
    }
}

const verifyInvestor = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                error: "Token Required"
            })
        }
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, secret)
        if (decoded.role !== 'investor') {
            return res.status(403).json({
                error: "Access Denied"
            })
        }
        req.user = decoded
        next()
    }
    catch (error) {
        return res.status(401).json({
            error: "Invalid Token"
        })
    }
}

module.exports = {signJwt,verifyInvestor}