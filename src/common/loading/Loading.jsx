import React from "react";
// import loadingSvg from "./loading.svg";
import loadingGif from "./loader.gif";
import "./loading.css";

function Loading() {
  return (
    <div className='global-loading-css'>
      <img width='80' height='80' src={loadingGif} alt='Loading' />
    </div>
  );
}

export default Loading;
