let mongoose = require('mongoose');

let recentlyViewedbusiness = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model('recentlyViewed_Business', recentlyViewedbusiness);
