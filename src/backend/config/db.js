const mongoose = require("mongoose");

// Constant URL
const mongourl = 'mongodb+srv://lokeshburade494:dkIkoYuoIct4d7LL@ocr-data.bpvpd.mongodb.net/?retryWrites=true&w=majority&appName=ocr-data';

mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000,
})
.then(() => {
    console.log("Database connected successfully");
})
.catch((err) => {
    console.error("Database connection error:", err.message);
});

module.exports = mongoose;
