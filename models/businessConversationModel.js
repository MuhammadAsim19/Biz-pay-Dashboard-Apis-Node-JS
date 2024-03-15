let mongoose = require('mongoose');

let businessConversationSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdFor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        blockedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        businessReff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        socketRoomId : String,
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
            }
        ]

    },
    { timestamps: true }
);

module.exports = mongoose.model('BusinessConversation', businessConversationSchema);
