// "deploy": "gh-pages -d build",

import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function App() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setText(''); // Clear previous text
        setError(''); // Clear previous errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('https://ocr-to-text-github-io.onrender.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setText(response.data.text);
        } catch (error) {
            console.error('Error during OCR processing:', error);
            setError('Failed to process the image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.text(text, 10, 10);
        doc.save("extracted_text.pdf");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center mb-6">OCR to Text Converter</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">Upload an Image</label>
                        <input type="file" id="imageUpload" onChange={handleImageChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" disabled={loading || !image}>
                        {loading ? 'Processing...' : 'Upload and Convert'}
                    </button>
                </form>
                {error && <div className="mt-4 text-red-500">{error}</div>}
                {text && (
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-2">Extracted Text:</h4>
                        <pre className="bg-gray-100 p-4 rounded-md border border-gray-300 max-h-48 overflow-y-auto text-sm">{text}</pre>
                        <button onClick={handleDownload} className="mt-4 w-full bg-green-500 text-white py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                            Download as PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
