let mongoose = require('mongoose');

let badgeSchema = new mongoose.Schema({
    title : String,
    price : Number,
    icon : {type : String , default : "/assets/1707205692065_Retail.svg"},
    paymentType : {
        type: String,
        enum: ['SINGLE', 'SUBSCRIPTION'],
        default : "SINGLE"
    },
    type :{
        type: String,
        enum: ['SELLER', 'BUYER']
    },
    
    
},{ timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);