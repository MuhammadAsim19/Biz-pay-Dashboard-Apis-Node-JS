let mongoose = require('mongoose');

let businessbadgeSchema = new mongoose.Schema({
    badgeReff: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Badge'
    },
    businessReff: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Business'
    },
    badgeRequestReff: { type: mongoose.Schema.Types.ObjectId, ref: 'BadgeRequest' },

}, { timestamps: true });

module.exports = mongoose.model('BusinessBadge', businessbadgeSchema);