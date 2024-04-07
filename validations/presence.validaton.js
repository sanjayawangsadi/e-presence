const { body } = require('express-validator');
const { DateTime } = require("luxon");
const { Latestpresences } = require('../repositories/presence.repository.js');

const presenceValidate = (fun) => {
    switch (fun) {
        case 'presence':
            return [
                body('type')
                    .custom(async (value, { req }) => {
                        const today = DateTime.now().toFormat('yyyy-LL-dd');
                        const auth = req.session.auth;
                        const userPresence = await Latestpresences(auth.user_id)
                        switch (value) {
                            case 'IN':
                                userPresence.forEach(presence => {
                                    let presenceDate = DateTime.fromJSDate(presence.time).toFormat('yyyy-LL-dd');
                                    if (presenceDate === today && presence.type === 'IN') {
                                        throw new Error('You have already checked in!')
                                    }
                                });
                                break;
                            case 'OUT':
                                userPresence.forEach(presence => {
                                    let presenceDate = DateTime.fromJSDate(presence.time).toFormat('yyyy-LL-dd');
                                    if (presenceDate === today && presence.type === 'OUT') {
                                        throw new Error('You have already checked OUT!')
                                    }
                                });
                                break;
                            default:
                                throw new Error('Type value should be IN or OUT!')
                        }
                    })
                    .notEmpty()
                    .withMessage('Type should not be empty!')
                    .escape(),
                body('waktu')
                    .notEmpty()
                    .withMessage('Waktu should not be empty!')
                    .escape()
            ];
        case 'approval':
            return [
                body('approve')
                    .isBoolean()
                    .withMessage('Approve must be a boolean Value!')
                    .notEmpty()
                    .withMessage('Approve should not be empty!')
            ]
    }
}

module.exports = {
    presenceValidate
};