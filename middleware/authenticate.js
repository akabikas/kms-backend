const jwt = require('jsonwebtoken')

const authenticateUser = (req,res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'Azo5sa@(s7@3ajd^&9&32')

        req.user = decode
        next()
    } catch (error) {
        res.json({
            message: 'Authentication Failed!'
        })
    }
}


module.exports = authenticateUser