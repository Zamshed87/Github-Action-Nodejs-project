/*
 * Title: Letter Config Landing
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

const TemplateViewModal = ({ singleData }: any) => {
  return (
    <>
      <div style={{ fontSize: "12px" }}>
        <div>
          Letter Name :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.letterName}</span>
        </div>
        <div>
          Letter Type :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.letterType}</span>
        </div>
        <div>
          Created By :{" "}
          <span style={{ fontWeight: "500" }}>
            {singleData?.createdByEmployee}
          </span>
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
