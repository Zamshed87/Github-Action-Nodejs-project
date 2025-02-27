/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import BackButton from "../../../../../common/BackButton";
import Loading from "../../../../../common/loading/Loading";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import { getAssessmentTypeId } from "../constants";
import EmployeeInfo from "./components/employeeInfo";
import QuestionsGroup from "./components/questionsGroup";
import { getModifiedData } from "./helper";

const initData = {
  assessmentToDDL: { value: "self", label: "Self" },
  employeeDDL: "",
  yearDDL: "",
  quarterDDL: "",
};
const BarAssessmentEvaluation = () => {
  const { id, yearId, quarterId } = useParams();
  const location = useLocation();
  const { assessmentType } = location.state;
  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state.auth.profileData
  );
  const [, getEvaluationData, evaluationDataLoader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [
    employeeInfo,
    getEmployeeInfo,
    getEmployeeInfoloader,
    setEmployeeInfo,
  ] = useAxiosGet();
  const [evaluationScale, getEvalueationScale, getEvalueationScaleLoading] =
    useAxiosGet();

  const [editableEvaluationData, setEditableEvalueationData] = useState([]);
  const [modifiedEvaluationData, setModifiedEvaluationData] = useState([]);

  const [isDisableInput, setIsDisableInput] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { setFieldValue, handleSubmit, errors, touched, values } = useFormik({
    initialValues: initData,
    onSubmit: (formValue) => {},
  });

  //Get employee info
  useEffect(() => {
    if (id) {
      getEmployeeInfo(
        `/Employee/EmployeeProfileView?employeeId=${id}&businessUnitId=${buId}&workplaceGroupId=${wgId}`,
        (data) => {
          if (data) {
            setEmployeeInfo({
              EmployeeId: id,
              DesignationName: data?.employeeProfileLandingView?.strDesignation,
              EmployeeOnlyName:
                data?.employeeProfileLandingView?.strEmployeeName,
            });
          }
        }
      );
    }
  }, [id]);

  //get evaluation scale
  useEffect(() => {
    getEvalueationScale(`/PMS/GetEvaluationCriteria?accountId=${orgId}`);
  }, []);

  //handle get evaluation data
  const handleGetEvaluationData = (assType) => {
    const assessmentTypeId = getAssessmentTypeId(assType);
    const url = `/PMS/GetQuestionireGroupForAssement?AccountID=${orgId}&AssesmentFromEmployeeID=${employeeId}&AssesmentToEmployeeId=${id}&AssesmentTypeId=${assessmentTypeId}&YearId=${yearId}&QuaterId=${quarterId}`;
    getEvaluationData(url, (data) => {
      setIsDisableInput(data?.isSubmit ? true : false);
      setEditableEvalueationData(data);
      setModifiedEvaluationData(getModifiedData(data));
    });
  };

  //get all evaluation data
  useEffect(() => {
    handleGetEvaluationData(assessmentType);
  }, [assessmentType, yearId, id, employeeId, quarterId]);

  //handle option selection for each question
  const handleSelectOption = ({ quesId, updatedPayload }) => {
    const data = structuredClone(editableEvaluationData);
    const updatedData = {
      ...data,
      questionList: data?.questionList.map((item) => {
        if (item?.intQestionireRowId === quesId) {
          return {
            ...updatedPayload,
          };
        } else
          return {
            ...item,
          };
      }),
    };

    setEditableEvalueationData(updatedData);
  };

  const saveAndSubmit = (data, type) => {
    if (isDisableInput) {
      return toast.warn("Already submitted");
    } else if (type === "save") {
      let intAssesmentTypeId = getAssessmentTypeId(assessmentType);
      const payload = {
        ...data,
        intAccountId: orgId,
        intAssmentById: employeeId,
        intAssmentToId: id,
        intQuaterId: quarterId,
        intYearId: yearId,
        intActionBy: employeeId,
        strAssesmentTypeName: assessmentType,
        intAssesmentTypeId,
        isSubmit: false,
      };
      console.log("payload", payload);
      saveData(
        "/PMS/SaveQuestionireGroupForAssement",
        payload,
        () => handleGetEvaluationData(assessmentType),
        true
      );
    } else if (type === "submit") {
      if (
        data?.questionList?.length &&
        data?.questionList?.every((item) => item?.numMarks !== null)
      ) {
        let intAssesmentTypeId = getAssessmentTypeId(assessmentType);
        const submitPayload = {
          ...data,
          intAccountId: orgId,
          intAssmentById: employeeId,
          intAssmentToId: id,
          intQuaterId: quarterId,
          intYearId: yearId,
          intActionBy: employeeId,
          strAssesmentTypeName: assessmentType,
          intAssesmentTypeId,
          isSubmit: true,
        };
        saveData(
          "/PMS/SaveQuestionireGroupForAssement",
          submitPayload,
          () => handleGetEvaluationData(assessmentType),
          true
        );
      } else {
        return toast.warn("Please answer all the questions");
      }
    } else {
    }
  };

  return (
    <>
      {(evaluationDataLoader ||
        saveDataLoader ||
        getEmployeeInfoloader ||
        getEvalueationScaleLoading) && <Loading />}
      <div className="table-card mb-2">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>BAR Assesment Evaluation</h2>
          </div>
          {!isDisableInput && (
            <ul className="d-flex flex-wrap">
              <li className="mr-1">
                <button
                  type="button"
                  onClick={() => {
                    saveAndSubmit(editableEvaluationData, "save");
                  }}
                  className="btn btn-green w-100"
                >
                  Save
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    saveAndSubmit(editableEvaluationData, "submit");
                  }}
                  className="btn btn-green w-100"
                >
                  Submit
                </button>
              </li>
            </ul>
          )}
        </div>
        <div className="card-style pb-1 mb-4">
          <EmployeeInfo employeeInfo={employeeInfo} />
        </div>
        <div className="mx-3">
          {modifiedEvaluationData?.length > 0 &&
            modifiedEvaluationData.map((group, groupIdx) => (
              <QuestionsGroup
                key={groupIdx + 1}
                group={group}
                groupNo={groupIdx + 1}
                options={evaluationScale?.scaleList}
                handleSelectOption={handleSelectOption}
                disabled={isDisableInput}
              />
            ))}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default BarAssessmentEvaluation;
