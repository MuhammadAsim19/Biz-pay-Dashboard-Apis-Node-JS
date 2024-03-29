let mongoose = require('mongoose');

let brokerConversationSchema = new mongoose.Schema(
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
        brokerReff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Broker',
        },
        socketRoomId : String,
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
            }
        ]

    },
    { timestamps: true }
);

module.exports = mongoose.model('BrokerConversation', brokerConversationSchema);
