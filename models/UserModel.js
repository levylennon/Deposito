const mongoose                          = require('mongoose');
const Schema                            = mongoose.Schema;

const User = new Schema({
    Name: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Level: {
        type: Number,
        required: true,
        default: 0
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('user', User);