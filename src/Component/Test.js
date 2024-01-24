import React, { useState } from 'react';

const PdfToBase64Converter = () => {
    const [base64String, setBase64String] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result.split(',')[1]; // Extracting base64 string
                setBase64String(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    console.log(base64String)

    return (
        <div className='mt-2'>
            <input type="file" onChange={handleFileChange} />
            {base64String && (
                <div>
                    <p>Base64 String:</p>
                    <textarea rows={10} value={base64String} readOnly />
                </div>
            )}
        </div>
    );
};

export default PdfToBase64Converter;
