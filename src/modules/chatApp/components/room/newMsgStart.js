import React from "react";

export default function NewMsgStart() {
  return (
    <>
      <div
        style={{
          height: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h4 className="opacity-75">
            Say Hi
            <span role="img" aria-label="hi">
              &#128075;
            </span>
          </h4>
        </div>
      </div>
    </>
  );
}
