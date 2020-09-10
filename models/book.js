//Book Scehema
let mongoose = require('mongoose');

let bookSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{
        type: String,
        require: true
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    dop: Date,

    ISBN: {
        type:String,
        validate: {validator: function (isbn) {
            return isbn.length ==13
            
        }
        }
    },
    summary:String,

    /*
    created:{
        type: String,
        default: Date.now()
    }
    */
});

module.exports = mongoose.model('Book', bookSchema);