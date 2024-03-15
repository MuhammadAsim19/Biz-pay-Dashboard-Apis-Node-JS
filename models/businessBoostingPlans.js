let mongoose = require('mongoose');

let businessBoostingSchema = new mongoose.Schema({
    title : String,
    price : Number,
    duration : String,
    daysInNumber : Number
   
},{ timestamps: true });

module.exports = mongoose.model('BusinessBoostingPlans', businessBoostingSchema);