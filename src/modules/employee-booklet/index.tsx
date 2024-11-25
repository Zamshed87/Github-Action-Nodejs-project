//@ts-nocheck

import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import "./booklet.css";

const EmployeeBooklet = () => {
  const book = useRef();

  const goToPreviousPage = () => {
    if (book.current) {
      book.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (book.current) {
      book.current.pageFlip().flipNext();
    }
  };
  return (
    <div className="mt-5">
      hi
      {/* <HTMLFlipBook
        width={400}
        height={300}
        ref={book}
        maxShadowOpacity={1}
        showCover={false}
        drawShadow={true}
        className="flipbook"
        flippingTime={1000}
      >
        <div className="page no-click interactive">Hi</div>
        <div className="page no-click interactive">Hi 2</div>
        <div className="page no-click interactive">Hi 3</div>
        <div className="page no-click interactive">Hi 4</div>
        <div className="page no-click interactive">Hi 5</div>
        <div className="page no-click interactive">Hi 5</div>
      </HTMLFlipBook> */}
    </div>
  );
};

export default EmployeeBooklet;
