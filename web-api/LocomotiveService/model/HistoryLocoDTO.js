const mongoose = require('mongoose');
const HistoryLocoSchema = new mongoose.Schema({
    locoCatId: {
        type: String,
        required: true,
    },
    locoNumber: {
        type: Number,
        required: true
    },
    locoPower: {
        type: Number,
        required: true
    },
    locoMileage: {
        type: Number,
        required: true
    },
    locoDate: {
        type: String,
        required: true
    },
    userNic: {
        type: String,
        required: true
    },
    supervisorName: {
        type: String,
        required: true
    },
    supervisorEmail: {
        type: String,
        required: true
    },
    locoAvailability: {
        type: String,
        required: true
    },

    locoMotors: [{
        Name: {
            type: String,
        },
        working: {
            type: String
        },
        notWorking: {
            type: String
        }
    }],
    locoBreaks: [{
        bName: {
            type: String,
        },
        working: {
            type: String
        },
        notWorking: {
            type: String
        }
    }],
    locoFluids: [{
        fName: {
            type: String,
        },
        fluids: {
            type: Number
        },
    }],

    locoNote: {
        type: String,
        required: true
    },
    locoStatus: {
        type: Number,
        required: false
    },
    statusReason: {
        type: String,
        required: false
    },
    lastLoadDate: {
        type: String,
        required: false
    },
    image: {
        type: Array,
        required: false
    },
    scheduleIdArray: [{
        SId: {
            type: Number,
            required: false

        }
    }],
    endMileage: {
        type: String,
        required: false
    },
    endMileDate: {
        type: String,
        required: false
    },


});

module.exports = mongoose.model('HistoryLoco', HistoryLocoSchema)