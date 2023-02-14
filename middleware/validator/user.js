const { check, validationResult } = require('express-validator');
exports.validateUserSignUp = [
    check('fullname').trim().not().isEmpty().withMessage('firstname must not empty').isString().withMessage('first name must be valid').isLength({ min: 3, max: 20 }).withMessage('Name must be within 3 to 20 character!'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    check('password').trim().not().isEmpty().withMessage('password must not empty').isLength({ min: 8, max: 20 }).withMessage('Password must be within 8 to 20 long!'),
    check('confirmPassword').trim().not().isEmpty().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Both password must be same!')
        }
        return true;
    })

];

exports.userValidaion = (req, res, next) => {
    const result = validationResult(req).array();
    if (!result.length) return next();

    const error = result[0].msg;
    res.json({ success: false, message: error })
};
exports.validateUserSignin = [
    check('email').trim().isEmail().withMessage('email/ password is required!'),
    check('password').trim().not().isEmpty().withMessage('email/ password is required!'),

]