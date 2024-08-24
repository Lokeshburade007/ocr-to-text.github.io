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


// Using api

// const express = require('express');
// const multer = require('multer');
// const FormData = require('form-data');
// const fs = require('fs');
// const https = require('https');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const upload = multer({ dest: 'uploads/' });

// app.post('/ocr', upload.single('image'), (req, res) => {
//     const imagePath = req.file.path;

//     const form = new FormData();
//     form.append('image', fs.createReadStream(imagePath));

//     const options = {
//         method: 'POST',
//         hostname: 'image-to-text-api-from-imagetotext-io.p.rapidapi.com',
//         path: '/conversion',
//         headers: {
//             'x-rapidapi-key': 'your-rapidapi-key', // Replace with your RapidAPI key
//             'x-rapidapi-host': 'image-to-text-api-from-imagetotext-io.p.rapidapi.com',
//             ...form.getHeaders()  // Automatically adds the correct Content-Type with boundary
//         }
//     };

//     const reqStream = https.request(options, (resStream) => {
//         const chunks = [];

//         resStream.on('data', (chunk) => {
//             chunks.push(chunk);
//         });

//         resStream.on('end', () => {
//             const body = Buffer.concat(chunks);
//             const response = JSON.parse(body.toString());
//             res.json({ text: response.text });
//         });
//     });

//     reqStream.on('error', (error) => {
//         console.error('Error during API request:', error);
//         res.status(500).send({ error: 'OCR processing failed' });
//     });

//     // Pipe the form data directly to the request
//     form.pipe(reqStream);
// });

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });
