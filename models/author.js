//Author Scehema

let mongoose = require('mongoose');

let authorSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },

    dob: Date,

    address:{
        state: {
            type:String, min:2,max:3
        },
        suburb: String,
        street: String,
        unit: String
    },

    numBooks:{
        type: Number,
        validate:{
            validator: function (numBooks) {
                return Number.isInteger(numBooks) && numBooks >= 1 && numBooks<=150;
            },
            message:'Number of book must be a integer between 1 and 150'
        }
    },


    //upadate
});

module.exports = mongoose.model('Author', authorSchema);