import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";

const useBarAssessmentEvaluation = () => {
  const { employeeId, yearId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const {state:{assessmentPeriod, assessmentTime}} = useLocation();
  
  const {
    permissionList,
    profileData: { buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30496) {
      permission = item;
    }
  });

  const [questionData, getData, questionsLoading, setQuestionData] =
    useAxiosGet({});
  const [saveRes, saveBarAssessmentData, saveLoading, setSaveData] =
    useAxiosPost({});

  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const getBarAssessmentQuestions = () => {
    getData(
      `/PMS/BARAssessmentEmployeeData?employeeId=${employeeId}`,
      (res) => {
        setQuestionData(res);
      }
    );
  };
  
  const saveBARAssessmentData = ({ assessmentPeriod, assessmentTime }) => {
    saveBarAssessmentData(
      `/PMS/BARAssessment`,
      {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        employeeId: employeeId,
        year: yearId,
        assesmentPeriod: assessmentPeriod,
        assesmentTime: assessmentTime,
        questions: answeredQuestions,
      },
      (res) => {
        setSaveData(res);
        history.push({
          pathname: `/pms/performanceAssessment/BARAssessment`,
        });
      },
      true,
      "BARAssessment Saved Successfully."
    );
  };

  const handleAnswerQuestion = (answer) => {
    const answerExists = answeredQuestions?.find((aq) => aq?.id == answer?.id);
    if (answerExists) {
      const filteredAnswer = answeredQuestions?.filter(
        (aq) => aq?.id != answer?.id
      );
      setAnsweredQuestions([...filteredAnswer, answer]);
    } else {
      setAnsweredQuestions([...answeredQuestions, answer]);
    }
  };

  const getSelectedAnswer = (question) => {
    const answerExists = answeredQuestions?.find(
      (aq) => aq?.id == question?.id
    );
    if (answerExists) {
      return answerExists;
    } else {
      return false;
    }
  };

  function areAllQuestionsAnswered() {
    const questionIds = new Set(
      questionData?.groups?.flatMap((g) => g?.questions).map((q) => q.id)
    );
    const answeredIds = new Set(answeredQuestions?.map((a) => a.id));
    return [...questionIds].every((id) => answeredIds.has(id));
  }

  useEffect(() => {
    getBarAssessmentQuestions();
    dispatch(setFirstLevelNameAction("Performance Management System"));
  }, []);

  return {
    permission,
    questionData,
    getBarAssessmentQuestions,
    questionsLoading,
    saveRes,
    saveLoading,
    saveBARAssessmentData,
    handleAnswerQuestion,
    getSelectedAnswer,
    areAllQuestionsAnswered,
    assessmentPeriod, assessmentTime
  };
};

export default useBarAssessmentEvaluation;
