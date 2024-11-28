//@ts-nocheck

import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import "./booklet.css";
import PersonalInfo from "./contents/PersonalInfo";

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
    <div className="mt-5 book-wrapper">
      <button onClick={goToPreviousPage}>Prev page</button>
      <HTMLFlipBook
        width={400}
        height={300}
        ref={book}
        maxShadowOpacity={1}
        showCover={false}
        drawShadow={true}
        className="flipbook"
        flippingTime={1000}
      >
        <div className="page">
          <PersonalInfo id={1} />{" "}
        </div>
        <div className="page">
          <PersonalInfo id={2} />{" "}
        </div>
        <div className="page">
          <PersonalInfo id={3} />{" "}
        </div>
        <div className="page">
          <PersonalInfo id={4} />{" "}
        </div>
        <div className="page">
          <PersonalInfo id={5} />{" "}
        </div>
        <div className="page">
          <PersonalInfo id={6} />{" "}
        </div>
      </HTMLFlipBook>
      <button onClick={goToNextPage}>Next page</button>
    </div>
  );
};

export default EmployeeBooklet;
