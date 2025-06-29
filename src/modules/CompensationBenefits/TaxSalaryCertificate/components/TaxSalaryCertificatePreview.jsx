import Loading from "common/loading/Loading";
import React, { useRef } from "react";
import { PButton } from "Components";
import { useReactToPrint } from "react-to-print";

const TaxSalaryCertificatePreview = ({ data, loading }) => {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "TaxSalaryCertificatePreview",
  });

  return (
    <div style={{ minHeight: 400, position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <PButton
          content="Print"
          type="primary"
          onClick={handlePrint}
          icon={null}
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div
          ref={contentRef}
          style={{ width: "100%", overflow: "auto", display: "flex", justifyContent: "center" }}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      )}
    </div>
  );
};

export default TaxSalaryCertificatePreview;
