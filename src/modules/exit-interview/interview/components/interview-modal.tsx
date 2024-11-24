import NoResult from "common/NoResult";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getQuestionaireById } from "../helper";

const InterviewModal = () => {
  const location: any = useLocation();

  console.log(location);

  const [singleData, setSingleData] = useState(null);
  const [loading, setLoading] = useState(false);
  // const

  useEffect(() => {
    getQuestionaireById(location?.state?.quesId, setSingleData, setLoading);
  }, []);

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
