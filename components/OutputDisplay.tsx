
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CopyIcon, PrintIcon, CheckIcon, LoadingIcon, PdfIcon } from './icons';

interface OutputDisplayProps {
  generatedText: string;
  isLoading: boolean;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ generatedText, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
  };

  const handleSavePdf = () => {
    const input = contentRef.current;
    if (!input) return;

    const scrollableParent = input.parentElement;
    if (scrollableParent) {
      scrollableParent.scrollTop = 0;
    }

    const F4_WIDTH_MM = 210;
    const F4_HEIGHT_MM = 330;
    const marginTop = 30, marginRight = 15, marginBottom = 20, marginLeft = 20;
    const contentWidth = F4_WIDTH_MM - marginLeft - marginRight;
    const pageContentHeight = F4_HEIGHT_MM - marginTop - marginBottom;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowHeight: input.scrollHeight,
      scrollY: 0,
    }).then(canvas => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const doc = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: [F4_WIDTH_MM, F4_HEIGHT_MM]
      });

      const pageHeightInCanvasPixels = (pageContentHeight / contentWidth) * canvasWidth;
      const totalPages = Math.ceil(canvasHeight / pageHeightInCanvasPixels);

      for (let i = 0; i < totalPages; i++) {
        const startY = i * pageHeightInCanvasPixels;
        const sliceHeight = Math.min(pageHeightInCanvasPixels, canvasHeight - startY);

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvasWidth;
        sliceCanvas.height = sliceHeight;
        const sliceContext = sliceCanvas.getContext('2d');
        
        if (sliceContext) {
            sliceContext.drawImage(canvas, 0, startY, canvasWidth, sliceHeight, 0, 0, canvasWidth, sliceHeight);
        }

        const sliceDataUrl = sliceCanvas.toDataURL('image/png');
        const sliceImgHeightMm = (sliceHeight / canvasWidth) * contentWidth;
        
        if (i > 0) {
            doc.addPage();
        }
        doc.addImage(sliceDataUrl, 'PNG', marginLeft, marginTop, contentWidth, sliceImgHeightMm);
      }

      doc.save('Perencanaan-Kokurikuler.pdf');
    });
  };

  const handlePrint = () => {
    const contentToPrint = contentRef.current;
    if (contentToPrint) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Cetak Rencana</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com?plugins=typography"></script>');
        printWindow.document.write(`
          <style>
            @media print {
              @page {
                size: 210mm 330mm; /* F4 Size */
                margin: 3cm 1.5cm 2cm 2cm; /* T, R, B, L */
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
               h1, h2, h3, h4, table, li {
                page-break-inside: avoid;
              }
            }
          </style>
        `);
        printWindow.document.write('</head><body class="bg-white">');
        printWindow.document.write('<div class="prose max-w-none">');
        printWindow.document.write(contentToPrint.innerHTML);
        printWindow.document.write('</div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <LoadingIcon className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">Generating your curriculum plan...</p>
          <p className="text-sm">The AI architect is crafting the details. This may take a moment.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center text-red-600">
          <div>
            <h3 className="text-lg font-semibold">An Error Occurred</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      );
    }
    if (!generatedText) {
      return (
        <div className="flex items-center justify-center h-full text-center text-gray-500">
          <div>
            <h3 className="text-lg font-semibold">Ready to Build</h3>
            <p className="text-sm mt-1">Fill out the form on the left and click "Generate Plan" to create your co-curricular document.</p>
          </div>
        </div>
      );
    }
    return (
        <div 
            ref={contentRef}
            className="prose prose-sm sm:prose-base max-w-none p-6 output-content-area"
            dangerouslySetInnerHTML={{ __html: marked.parse(generatedText || '') }} 
        />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full min-h-[80vh]">
        {generatedText && !isLoading && (
            <div className="sticky top-24 z-5 bg-gray-50/80 backdrop-blur-sm p-3 border-b border-gray-200 flex justify-end items-center space-x-2 rounded-t-xl">
                <button onClick={handleCopy} className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                    {copied ? <CheckIcon/> : <CopyIcon/>}
                    <span className="ml-1.5">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button onClick={handlePrint} className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                    <PrintIcon/>
                    <span className="ml-1.5">Print</span>
                </button>
                <button onClick={handleSavePdf} className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                    <PdfIcon/>
                    <span className="ml-1.5">Simpan PDF</span>
                </button>
            </div>
        )}
        <div className={generatedText ? "overflow-auto" : "flex justify-center items-center h-full"}>
            {renderContent()}
        </div>
    </div>
  );
};

export default OutputDisplay;
