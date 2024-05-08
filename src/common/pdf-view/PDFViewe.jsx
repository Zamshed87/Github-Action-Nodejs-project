import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./style.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js"; // Import pdf.worker.min.js directly

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker; // Set workerSrc directly

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/legacy/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const PDFViewer = ({ pdfUrl = "" }) => {
  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <div className="Example mx-2">
      <div className="Example__container">
        <div className="Example__container__document">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
