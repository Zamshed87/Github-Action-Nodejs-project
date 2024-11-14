const TemplateViewModal = ({ singleData }: any) => {
  return (
    <>
      <div style={{ fontSize: "12px" }}>
        <div>
          Issued Type :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.issueTypeName}</span>
        </div>
        <div>
          Letter Name :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.letterName}</span>
        </div>
        <div>
          Letter Type :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.letterType}</span>
        </div>
        <div>
          Issued To :{" "}
          <span style={{ fontWeight: "500" }}>
            {singleData?.issueForEmployeeName}
          </span>
        </div>
        <div>
          Issued By :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.issueTypeName}</span>
        </div>
      </div>
      <div className="mt-2">
        <p>Letter Template </p>
        <div
          dangerouslySetInnerHTML={{
            __html: singleData?.letterBody,
          }}
        />
      </div>
    </>
  );
};

export default TemplateViewModal;
