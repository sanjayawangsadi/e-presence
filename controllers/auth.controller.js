const { authenticate, storeAccessToken, deactivateAccessToken } = require('../repositories/auth.repository.js');
const { validationResult, matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const { DateTime, Duration } = require("luxon");
const { compare } = require('../functions/hash.js');

const accessToken = (async (req, res) => {
    const dateTime = DateTime.now();
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(422).json({
            message: "Validation Error!",
            data: {
                errors: result.array()
            }
        });
    }

    const profile = {
        user_id: null,
        name: null,
        email: null,
        npp: null,
        is_supervisor: false,
        supervisor: null
    }

    const reqData = matchedData(req)
    await authenticate(reqData.email).then(async (user) => {
        const comparePassword = await compare(reqData.password, user.password);
        if (comparePassword) {
            profile.user_id = user.id;
            profile.name = user.name;
            profile.email = user.email;
            profile.npp = user.npp;
            profile.is_supervisor = user.supervisor === null ? true : false
            profile.supervisor = user.supervisor
        } else {
            return res.status(422).json({
                message: 'Incorrect email or password!',
                data: null
            })
        }
    }).catch((e) => {
        return res.status(422).json({
            message: 'Incorrect email or password!',
            data: null,
        })
    });

    const expiresIn = Duration.fromObject({ hours: 2, minutes: 0 })
        .as('seconds');

    const accessToken = jwt.sign(profile, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn,
    });

    await storeAccessToken({
        user_id: profile.user_id,
        access_token: accessToken,
        active: true,
        expires: dateTime.plus({ hours: 2, minutes: 0 })
    })

    return res.status(200).json({
        message: 'Success generate access token',
        data: {
            token_type: "Bearer",
            expires_in: expiresIn,
            access_token: accessToken,
            profile: profile
        }
    })
})

const revokeToken = (async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(422).json({
            message: "Validation Error!",
            data: {
                errors: result.array()
            }
        });
    }

    const accessTokenId = req.session.accessTokenId
    await deactivateAccessToken(accessTokenId)
        .then((token) => {
            return res.status(200).json({
                message: 'Token revoked!',
                data: null,
            })
        }).catch((e) => {
            return res.status(500).json({
                message: 'Internal Server Error!',
                data: null
            })
        })


})

module.exports = {
    accessToken,
    revokeToken
}