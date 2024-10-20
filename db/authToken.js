const mongoose = require('mongoose');

const authTokenDb = new mongoose.Schema({
    token:{
        type:String
    },
    logs:{
        type:String
    }
});

const authTokenString = mongoose.model('Tokens', authTokenDb);

module.exports = authTokenString;
