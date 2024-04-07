const { body } = require('express-validator');

const authValidate = () => {
    return [
        body('email')
            .isEmail()
            .withMessage('Invalid Email Address')
            .escape(),
        body('password')
            .isLength({
                min: 8
            })
            .withMessage('Password must be 8 characters')
            .escape()
    ];
}

module.exports = {
    authValidate
};