const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    profilePic: {type : String , default : null},
    salt: String,
    country: String,
    city: String,
    address: String,
    password: String,
    dob: Date,
    registerationMethod  : {
        type: String,
        enum: ['EMAIL', 'SOCIAL']
        },
    age: Number,
    accountStatus: {
        type: String,
        enum: ['active', 'freezed', 'suspended', 'deactivated'],
        default: 'active',
    },
    fcm_token: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    resetPasswordGeneratedAt: {
        type: Date
    },
    agreed_to_policies: {
        type: Boolean,
        default: false
    },
    onlineStatus: {
        type: Boolean,
        default: false
    },
    agreed_to_policy_version: {
        type: String,
        default : null
    },
    forgetPasswordOTP: {
        type: String,
    },
    registerationOTP: {
        otp : {type: Number},
        isVerified :{type:Boolean ,default:false},
        generatedAt : Date ,
        expiresAt : Date ,
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole', required: true },
    paidBadges :  [
        {type: mongoose.Types.ObjectId, ref: 'BusinessBadge'}
    ],
    buyerBadges:[
        {type: mongoose.Types.ObjectId, ref: 'Badge'}
    ],
    businesses: [{
        type: mongoose.Types.ObjectId, ref: 'Business'
    }],
    businesses_wishlist: [{
        type: mongoose.Types.ObjectId, ref: 'Business'
    }],
    recentlyViewed_Business: [{
        type: mongoose.Types.ObjectId, ref: 'Business'
    }],

}, { timestamps: true })


const User = mongoose.model('User', userSchema)
module.exports = User;