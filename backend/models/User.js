const mongoose =  require('mongoose');
const { Schema } = mongoose;

//This is a schema of our user data
//This is how our user's data will store
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    timeStamp:{
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('user',UserSchema);
// User.createIndexes();
module.exports = User;