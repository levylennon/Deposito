const mongoose                          = require('mongoose');
const Schema                            = mongoose.Schema;

const Measures = new Schema({
    Description: {
        type: String,
        required: true
    },
    Abbreviation: {
        type: String,
        required: true
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

mongoose.model('measures', Measures);