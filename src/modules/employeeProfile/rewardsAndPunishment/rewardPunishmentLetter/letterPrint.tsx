/*
 * Title: Print letter
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

const LetterPrint = ({ singleData }: any) => {
  return (
    <div
      style={{ fontSize: "50% !important", padding: "20px" }}
      dangerouslySetInnerHTML={{
        __html: singleData?.generatedLetterBody,
      }}
    />
  );
};

export default LetterPrint;
