import React from "react";
import { Spinner } from "react-bootstrap";

export default function SpinnerComponent({ isShow }) {
   return (
      <div>
         {isShow && (
            <div
               style={{ height: "60vh" }}
               className="d-flex justify-content-center align-items-center"
            >
               <Spinner animation="grow" variant="light" />
               <Spinner animation="grow" variant="primary" />
               <Spinner animation="grow" variant="secondary" />
               <Spinner animation="grow" variant="success" />
               <Spinner animation="grow" variant="danger" />
               <Spinner animation="grow" variant="warning" />
               <Spinner animation="grow" variant="info" />
               <Spinner animation="grow" variant="dark" />
            </div>
         )}
      </div>
   );
}
