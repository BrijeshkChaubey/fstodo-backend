const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userScema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },
    avatar: Buffer,


});
userScema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 8, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        })
    }
})
userScema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('Password is missing, can not compare !');

    try {
        const reesult = await bcrypt.compare(password, this.password)
        return reesult;
    } catch (error) {
        console.log('Error while comparig password!', error.message)
    }
}

userScema.statics.isThisEmailInUse = async function (email) {
    if (!email) throw new Error('Invalid Email');
    try {
        const user = await this.findOne({ email })
        if (user) return false
        return true;

    } catch (error) {
        console.log("error inside isThisEmailInUse method", error.message)
        return false
    }
}
module.exports = mongoose.model('User', userScema)