const { checkAccessToken } = require('../repositories/auth.repository');
const { DateTime } = require("luxon");
const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
    const accessToken = req.headers.authorization && req.headers.authorization.match(/^Bearer (.*)$/);
    if (!accessToken) {
        return res.status(403).json({
            message: 'Forbidden!',
            data: null
        })
    }

    const datetime = DateTime.now().toUnixInteger();
    await checkAccessToken(accessToken[1])
        .then((token) => {
            const tokenExpires = DateTime.fromJSDate(token.expires).toUnixInteger();
            if (datetime <= tokenExpires) {
                if (!token.active) {
                    return res.status(422).json({
                        message: 'Invalid Access Token!',
                        data: null
                    })
                }
                const decoded = jwt.verify(token.access_token, process.env.JWT_ACCESS_TOKEN_SECRET)
                req.session.accessTokenId = token.id
                req.session.auth = decoded;
                req.session.expires = decoded?.exp;
                next();
            } else {
                return res.status(422).json({
                    message: 'Expired Access Token!',
                    data: null
                })
            }
        }).catch((e) => {
            return res.status(422).json({
                message: 'Invalid Access Token!',
                data: null
                
            })
        });
}

const isSupervisor = async (req, res, next) => {
    const auth = req.session.auth;
    if (!auth.is_supervisor) {
        return res.status(401).json({
            message: 'You have no permission!',
            data: null
        })
    }

    next()
}

module.exports = {
    authentication,
    isSupervisor
}