import React from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useNavigate } from 'react-router-dom';




import * as pdfjs from 'pdfjs-dist'

//pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//  'pdf.worker.js',
//import.meta.env.BASE_URL
//).toString()

pdfjs.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.js`;

const ReflectionPage = () => {
    const defaultLayout = defaultLayoutPlugin();
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            {/* Button to navigate to the REMIX page */}
            <button
                onClick={() => navigate('/EnglishEssayWebsite/')}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                REMIX
            </button>

            {/* PDF Viewer */}
            <div style={{ height: '90%', marginTop: '40px' }}>
                <Viewer fileUrl="/EnglishEssayWebsite/public/document.pdf" plugins={[defaultLayout]} />
            </div>
        </div>
    );
};

export default ReflectionPage;
