const express = require('express');

const router = express.Router();
const { createUser, userSignIn } = require('../controllers.js/user');
const { isAuth } = require('../middleware/auth');
const { validateUserSignUp, userValidaion, validateUserSignin } = require('../middleware/validator/user');
const User = require('../models/user');
const multer = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file', false);
    }
}
const uploads = multer({ storage, fileFilter })
router.post('/create-user', validateUserSignUp, userValidaion, createUser);
router.post('/signin', validateUserSignin, userValidaion, userSignIn);
router.post('/upload-prfile', isAuth, uploads.single('profile'), async (req, res) => {
    const { user } = req
    if (!user) return res.status(401).json({ success: false, message: 'unauthorized acess' })
    try {
        const profileBuffer = req.file.buffer;
        const { width, height } = await sharp(profileBuffer).metadata();
        const avatar = await sharp(profileBuffer).resize(Math.round
            (width * 0.5), Math.round(height * 0.5)).toBuffer();

        await User.findByIdAndUpdate(user._id, { avatar });
        res.status(201).json({ success: true, message: ' Your profile is updated!' })
    } catch (error) {
        res.status(500).json({ success: false, message: ' server error try sometime' })

        console.log('Error while uploading profile image', error.message);
    }

}
)

module.exports = router;