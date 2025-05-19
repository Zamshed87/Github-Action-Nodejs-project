import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import AntTable from "../../../../../common/AntTable";
import DefaultInput from "../../../../../common/DefaultInput";
import Loading from "../../../../../common/loading/Loading";
// import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import { isUniq } from "../../../../../utility/uniqChecker";
import {
  onUpdateQuestionGroupNameAndQuestion,
  questionairesTableColum,
} from "./helper";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../../utility/customColor";
import { toast } from "react-toastify";

const initialValues = {
  questionnairesGroupName: "",
  strQuestion: "",
  numWeightage: "",
  isReverseQuestion: false,
};

const EditQuestionnaires = ({
  data,
  orgId,
  permission,
  onHide,
  employeeId,
  questionGroupId,
}) => {
  const [quesitonsList, setQuesitonsList] = useState([]);
  const [, getQuestionnairesById, loadingOnGetQuestionnaires] = useAxiosGet();
  const [
    ,
    updateQuestionnariesGroupNameAndQUestions,
    loadingUpdateQuestionnariesGroupNameAndQUestions,
  ] = useAxiosPost();
  const {
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    resetForm,
    values,
  } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      if (questionGroupId) {
        if (quesitonsList?.length === 0) {
          return toast.warn("Add at least one question");
        }
        onUpdateQuestionGroupNameAndQuestion({
          employeeId,
          questionGroupId,
          formValues,
          quesitonsList,
          orgId,
          updateQuestionnariesGroupNameAndQUestions,
          onHide,
          resetForm,
        });
      }
    },
  });

  useEffect(() => {
    if (questionGroupId) {
      getQuestionnairesById(
        `/PMS/GetQuestionById?id=${questionGroupId}&accountId=${orgId}`,
        (data) => {
          console.log("get by data", data);
          if (data?.intHeaderId === questionGroupId) {
            setFieldValue("questionnairesGroupName", data?.strGroupName);
            setFieldValue("numWeightage", data?.numWeightage);
          }
          if (data?.questionRows?.length > 0) {
            setQuesitonsList([...data?.questionRows]);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionGroupId]);
  return (
    <>
      {loadingOnGetQuestionnaires ||
      loadingUpdateQuestionnariesGroupNameAndQUestions ? (
        <Loading />
      ) : (
        <div className="add-new-employee-form">
          <div className="row ml-3 mb-2">
            <h1>Level of Leadership: </h1> <h2>{data?.label}</h2>
          </div>
          <div className="row m-0">
            <div className="col-md-6">
              <label>Question Group Name</label>
              <DefaultInput
                classes="input-sm"
                value={values?.questionnairesGroupName}
                name="questionnairesGroupName"
                disabled={true}
                type="text"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("questionnairesGroupName", e.target.value);
                }}
              />
            </div>
            <div className="col-md-6">
              <label>Weight</label>
              <DefaultInput
                classes="input-sm"
                value={values?.numWeightage}
                name="numWeightage"
                type="number"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("numWeightage", e.target.value);
                }}
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>
            <div className="col-md-6">
              <label>Question</label>
              <DefaultInput
                classes="input-sm"
                value={values?.strQuestion}
                name="strQuestion"
                type="text"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("strQuestion", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-2 mt-3 d-flex align-items-center">
              <FormikCheckBox
                styleObj={{
                  margin: "0 auto!important",
                  padding: "0 !important",
                  color: gray900,
                  checkedColor: greenColor,
                }}
                name="isReverseQuestion"
                checked={values?.isReverseQuestion}
                onChange={(e) => {
                  setFieldValue("isReverseQuestion", e.target.checked);
                }}
              />
              <label htmlFor="isReverseQuestion">Reverse Question</label>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                disabled={!values?.strQuestion}
                onClick={() => {
                  if (
                    isUniq("strQuestion", values?.strQuestion, quesitonsList)
                  ) {
                    setQuesitonsList((prev) => [
                      ...prev,
                      {
                        intRowId: 0,
                        strQuestion: values?.strQuestion,
                        isReverseQuestion: values?.isReverseQuestion,
                        intActionBy: employeeId,
                      },
                    ]);
                    setValues((prev) => ({
                      ...prev,
                      strQuestion: "",
                      isReverseQuestion: false,
                    }));
                  }
                }}
                className="btn btn-green mt-4"
              >
                Add
              </button>
            </div>
          </div>
          <div className="">
            <div className="p-3">
              {quesitonsList?.length > 0 ? (
                <div className="table-card-styled table-responsive tableOne mb-2">
                  <AntTable
                    removePagination={true}
                    data={quesitonsList || []}
                    columnsData={questionairesTableColum({
                      quesitonsList,
                      setQuesitonsList,
                    })}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="emp-create buttons-form-main row">
            <button
              type="button"
              className="btn btn-cancel mr-3"
              onClick={() => {
                onHide?.();
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-green"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditQuestionnaires;
