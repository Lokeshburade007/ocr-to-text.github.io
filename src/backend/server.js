const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;

    Tesseract.recognize(
        imagePath,
        'eng',
        { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
        // Clean up the uploaded image
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Failed to delete image:', err);
        });
        res.json({ text });
    }).catch(err => {
        console.error('OCR Error:', err);
        res.status(500).send({ error: 'OCR processing failed' });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});