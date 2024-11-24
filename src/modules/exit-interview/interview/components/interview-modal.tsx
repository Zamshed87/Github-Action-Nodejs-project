import NoResult from "common/NoResult";
import React from "react";

const InterviewModal = ({ singleData }: any) => {
  console.log(singleData);

  return singleData ? (
    <div>
      <div>InterviewModal</div>
    </div>
  ) : (
    <div className="mt-5">
      <NoResult />
    </div>
  );
};

export default InterviewModal;
