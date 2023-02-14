const express = require('express');
require('dotenv').config()
require('./models/db')
const userRouter = require('./routes/user')
const User = require('./models/user')
const app = express();
app.use(express.json())
app.use(userRouter);
// const test = async (email, password) => {
//     const user = await User.findOne({ email: email });
//     const result = await user.comparePassword(password);
//     console.log(result);

// };
// test('Brijesh@gmail.com', '123456789')

app.get('/', (req, res) => {
    res.send('<h1 style="color:red">Hello  King Brijesh</h1>');
})
app.listen(8000, () => {
    console.log('port is listening');
});
