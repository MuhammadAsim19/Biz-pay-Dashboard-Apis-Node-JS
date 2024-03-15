let mongoose = require('mongoose');

let experPackageSchema = new mongoose.Schema({
    title : String,
    price : Number,
    duration : String,
    daysInNumber : Number
},{ timestamps: true });

module.exports = mongoose.model('ExpertSubscription', experPackageSchema);