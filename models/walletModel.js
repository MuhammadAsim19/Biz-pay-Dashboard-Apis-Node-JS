let mongoose = require('mongoose');

let walletSchema = new mongoose.Schema(
    {
        userReff: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
        },
        walletId: {
            type: String,
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0, 
        },
    },
    { timestamps: true } 
);

module.exports = mongoose.model('Wallet', walletSchema);
