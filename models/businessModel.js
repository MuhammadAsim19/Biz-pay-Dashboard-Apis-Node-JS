const mongoose = require("mongoose")

const businessSchema = mongoose.Schema({
    name: String,
    foundationYear: String,
    numberOfOwners: Number,
    numberOfEmployes: Number,
    businessDescription: String,
    businessHours : String,
    registrationNumber : String,
    images: [String],
    attached_files: [String],
    viewsCount : {type : Number , default : 0},
    advantages: [String],
    salePrice: Number,
    financialDetails: [{
        financialYear: String,
        profit: Number,
        revenue: Number
    }],
    country: String,
    state: String,
    badges: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'BusinessBadge'
        }
    ],
    boosting: {
        payementIntentId: String,
        boostedAt: Date,
        expiresAt: Date,
        amount: Number,
        isActive: Boolean,
        packageReff: {
            type: mongoose.Types.ObjectId, ref: 'BusinessBoostingPlans'
        }

    },
    city: String,
    address: String,
    zipcode: String,
    industry: {
        type: mongoose.Types.ObjectId, ref: 'Category'
    },
    subIndustry: [{
        type: mongoose.Types.ObjectId, ref: 'SubCategory'
    }],

    status: {
        type: String,
        enum: ['pending', 'active', 'approved', 'rejected'],
        default: 'active',
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })


const Business = mongoose.model('Business', businessSchema)
module.exports = Business;