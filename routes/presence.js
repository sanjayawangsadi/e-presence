const express = require('express');
const route = express.Router();
const { authentication, isSupervisor } = require('../middlewares/interception.middleware.js')

const { getEmployees, getPresences, employeePresence, approvePresence, employeeApproval } = require('../controllers/presence.controller.js')
const { presenceValidate } = require('../validations/presence.validaton.js');

route.use(authentication);
route.get('/get-employees', isSupervisor, getEmployees)
route.get('/get-presences/:userId', getPresences)
route.post('/store-presence',presenceValidate('presence'), employeePresence)
route.get('/employee-approval/:userId', isSupervisor, employeeApproval)
route.put('/presence-approval/:presenceId', isSupervisor, presenceValidate('approval'), approvePresence)

module.exports = route;