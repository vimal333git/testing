import React from 'react';
import { pdfjs } from 'react-pdf';
import axios from 'axios';
import base64 from './base64.json';

// Configure PDF.js worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PdfToJpgConverter extends React.Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.canvasRef = React.createRef();
        this.state = {
            convertedImages: [],
        };
    }

    componentDidMount = () => {
        let base64_string = base64.file;
        this.base64ToFile(base64_string, 'file.pdf', 'application/pdf')
    }

    base64ToFile = (base64String, filename, mimeType) => {
        const byteCharacters = atob(base64String);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: mimeType });
        const new_pdf_file = new File([blob], filename, { type: mimeType });
        this.convertToJpg(new_pdf_file)
    }

    convertToJpg = async (file) => {
        // const file = this.fileInputRef.current.files[0];
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

                // Update state with the converted images
                this.setState({ convertedImages });
            } catch (error) {
                console.error('Error rendering PDF:', error);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    render() {
        const { convertedImages } = this.state;
        console.log(convertedImages)

        return (
            <div>
                <input type="file" ref={this.fileInputRef} accept=".pdf" />
                <button onClick={this.convertToJpg}>Convert to JPG</button>
                <div style={{ 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center' }} >
                    {convertedImages.map((imgDataUrl, index) => (
                        <img key={index} src={imgDataUrl} alt={`Converted JPG ${index}`} width={1000} />

                    ))}
                </div>

                <canvas ref={this.canvasRef} style={{ display: 'none' }} />
            </div>
        );
    }
}

export default PdfToJpgConverter;
