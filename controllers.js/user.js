const jwt = require('jsonwebtoken')
const User = require('../models/user')
exports.createUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    const isNewUser = await User.isThisEmailInUse(email)
    if (!isNewUser)
        return res.json({
            sucess: false,
            message: 'This email already exist, try new email',
        })
    const user = await User({ fullname, email, password });
    await user.save()
    res.json(user);
};
exports.userSignIn = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.json({ success: false, message: 'use not found ,with the given email!' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.json({ success: false, message: 'email,password does not match!' })

    const token = jwt.sign({ userId: user }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    res.json({ success: true, user, token })
};