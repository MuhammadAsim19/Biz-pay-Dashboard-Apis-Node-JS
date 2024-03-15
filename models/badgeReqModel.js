const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  userReff: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  expertReff: {
    type: Schema.Types.ObjectId,
    ref: 'Broker', 
    required: true,
  },
  businessReff: {
    type: Schema.Types.ObjectId,
    ref: 'Business', 
  },
  badgeReff: {
    type: Schema.Types.ObjectId,
    ref: 'Badge', 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isBadgeActive : Boolean,
  viewByDefault : Boolean,
  payment : {
    paymentIntentId : String,
    chargeId : String,
    chargeid : String,
    amount : Number,
    status: {
      type: String
    },

  },
  message : String,
  type: {
    type: String,
    enum: ['buyer', 'seller'], 
  },

  delivery :{
    attachment : String,
    message : String
  },
  attachment : String,
  status: {
    type: String,
    default : "pending",    
    enum: ['pending', 'accepted', 'rejected' , 'delivered' , 'approved'], 
  },
 
},{timestamps :true});

module.exports = mongoose.model('BadgeRequest', badgeSchema );
