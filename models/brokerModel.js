const mongoose = require("mongoose")

const BrokerScehma = mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    profileImage: String,
    email: { type: String },
    accountStatus: {
        type: String,
        enum: ['pending', 'freezed', 'active', 'suspended', 'deactivated'],
        default: 'pending',
    },
    educationAndCertification: [String],
    description: String,
    website: String,
    servingArea: {
        country: String,
        state: String,
        city: String,
        zipcode: String,
    },
    badges: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    ],
    badgeRequests : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'BadgeRequest' },
    ],
    wallet : { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    industries_served: [{
        type: mongoose.Types.ObjectId, ref: 'Category'
    }],
    connectedAccount : {
        id : String,
        link : String,
        isActive : Boolean
    },
    subscription: {
        payementIntentId: String,
        subscribedAt: Date,
        expiresAt: Date,
        amount: Number,
        isActive: Boolean,
        packageReff: {
            type: mongoose.Types.ObjectId, ref: 'ExpertSubscription'
        }

    },
    experties: {
        profession: String,
        yearOfExperience: Number,
        services_offered: [String]
    },

}, { timestamps: true })



const Broker = mongoose.model('Broker', BrokerScehma)
module.exports = Broker;