const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const materialSchema = new Schema(
    {
        product: {
            type: Schema.Types.Number,
            ref: "Products",
            required: true
        }
    }
);

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    username: {
        type: String,
        required: [true, 'Password is required']
    },
    list: [materialSchema]
},
    {timestamps: true}    
);

module.exports = mongoose.model('User', UserSchema);