//@ts-nocheck

import { Col, Row } from "antd";
import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import PersonalInfo from "./contents/PersonalInfo";
import "./booklet.css";

const FlipComponent = () => {
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
    <div>
      <Row gutter={16}>
        <Col style={{ backgroundColor: "red" }} md={6}></Col>
        <Col style={{ backgroundColor: "blue" }} md={18}>
          <div className="book-wrapper">
            <button onClick={goToPreviousPage}>Prev page</button>
            <button onClick={goToNextPage}>Next page</button>
            <HTMLFlipBook
              width={900}
              height={600}
              ref={book}
              maxShadowOpacity={3}
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
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FlipComponent;
