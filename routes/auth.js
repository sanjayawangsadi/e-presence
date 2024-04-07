const express = require('express');
const route = express.Router();
const { authentication } = require('../middlewares/interception.middleware.js')

const { accessToken, revokeToken } = require('../controllers/auth.controller.js')
const { authValidate } = require('../validations/auth.validation.js')

route.post('/access-token', authValidate(), accessToken)
route.delete('/revoke-token', authentication, revokeToken)

module.exports = route;