import React from "react";
import dotsLoading from "../../assets/images/dotsLoading.mp4";

export default function MessageLoader() {
  return (
    <div>
      <video loop="true" autoplay="autoplay" muted width={50}>
        <source src={dotsLoading} type="video/mp4" />
      </video>
    </div>
  );
}
