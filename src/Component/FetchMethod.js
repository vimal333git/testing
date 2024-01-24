import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';


const PdfViewer = ({ url }) => {
    const [pdfData, setPdfData] = useState(null);


    useEffect(() => {
        pdfBlob();
    }, [])

    const pdfBlob = async () => {
        const response = await axios.get('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', {
            responseType: 'arraybuffer', // Important! Set the response type to 'arraybuffer'
        });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const file = new File([pdfBlob], { type: 'application/pdf' }, { name: "pdf_to_file.pdf" });
        console.log(file)
        console.log(pdfBlob)
    }

    return (
        <div>
            <span>Hello</span>
        </div>
    );
};



export default PdfViewer;