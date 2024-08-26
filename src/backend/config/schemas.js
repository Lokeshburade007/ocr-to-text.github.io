// schemas.js
const mongoose = require('mongoose');

const ocrTextSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OCRText = mongoose.model('OCRText', ocrTextSchema);

module.exports = OCRText;


