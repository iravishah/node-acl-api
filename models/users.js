const uuidv1 = require('uuid/v1');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    uid: { type: String, default: uuidv1 },
    name: { type: String },
    role: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    delated_at: { type: Date, default: null }
});

mongoose.model('User', UserSchema);