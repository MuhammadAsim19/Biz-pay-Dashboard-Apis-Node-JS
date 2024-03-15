const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});


const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
