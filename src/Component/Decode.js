import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import base64 from './base64.json';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Base64ToPDFConverter extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            base64Data: base64.file, // Your Base64 data here
            fileName: 'converted_pdf', // The desired name for the downloaded PDF file
        };
    }

    convertBase64ToPDF = () => {
        const { base64Data, fileName } = this.state;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
        const new_pdf_file = new File([pdfBlob], 'sample.pdf', { type: 'application/pdf' });
        this.convertToJpg(new_pdf_file)
    };

    convertToJpg = async (file) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const arrayBuffer = reader.result;

            // Load PDF document
            const pdfData = new Uint8Array(arrayBuffer);
            const loadingTask = pdfjs.getDocument({ data: pdfData });

            try {
                const pdf = await loadingTask.promise;
                const numPages = pdf.numPages;
                const convertedImages = [];

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);

                    // Render PDF page on canvas
                    const viewport = page.getViewport({ scale: 1 });
                    const canvas = this.canvasRef.current;
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    // console.log(canvas.width, canvas.height)

                    await page.render({ canvasContext: context, viewport }).promise;

                    // Convert canvas to image (JPEG)
                    const imgDataUrl = canvas.toDataURL('image/jpeg');
                    convertedImages.push(imgDataUrl);
                }

                this.setState({ convertedImages })
            } catch (error) {
                console.error('Error rendering PDF:', error);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    render() {
        return (
            <div>
                {/* Your UI here */}
                <button onClick={this.convertBase64ToPDF}>Convert to PDF</button>
                <div style={{ 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center' }} >
                    {this.state.convertedImages?.map((imgDataUrl, index) => (
                        <img key={index} src={imgDataUrl} alt={`Converted JPG ${index}`} width={1000} />

                    ))}
                </div>
                <canvas ref={this.canvasRef} style={{ display: 'none' }} />
            </div>
        );
    }
}

export default Base64ToPDFConverter;
