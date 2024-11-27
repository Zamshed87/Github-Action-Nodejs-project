import { useFormik } from "formik";
import React, { useState } from "react";
import DefaultInput from "../../../../../common/DefaultInput";
import { createQuestionaireGroupTableColum } from "./helper";
import { toast } from "react-toastify";
import AntTable from "../../../../../common/AntTable";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../../common/loading/Loading";
import { useEffect } from "react";
const initialValues = {
  groupName: "",
  weight: "",
};
const AddQuestionnariesGroupName = ({
  employeeId,
  orgId,
  addQuestionnariesGroupName,
  onHide,
  permission,
  loadingAddQuestionnariesGroupName,
}) => {
  const [rowData, setRowData] = useState([]);
  const { setFieldValue, handleSubmit, errors, touched, resetForm, values } =
    useFormik({
      initialValues,
      onSubmit: (formValue) => {
        const savePayload = rowData.map((item) => {
          return {
            intHeaderId: item?.intHeaderId,
            strGroupName: item?.strGroupName,
            numWeightage: item?.numWeightage,
            intActionBy: employeeId,
            intAccountId: orgId,
            questionRows: [],
          };
        });

        if (!savePayload?.length) return toast.warn("Please add group name");

        const isAnyDuplicate = savePayload.some((item, index) => {
          return (
            savePayload.findIndex(
              (item2, idx) =>
                item2?.strGroupName?.toLowerCase() ===
                  item?.strGroupName?.toLowerCase() && idx !== index
            ) > -1
          );
        });

        if (isAnyDuplicate) return toast.warn("Group name must be unique");

        let isSumHundred = rowData.reduce((acc, curr) => {
          return acc + curr.numWeightage;
        }, 0);

        if (isSumHundred !== 100) {
          return toast.warn("Sum of weightage must be 100");
        }

        addQuestionnariesGroupName?.(
          `/PMS/SaveQuestionnaireHeader`,
          savePayload,
          () => {
            resetForm(initialValues);
            onHide?.();
          },
          true
        );
      },
    });

  const addhandler = (values) => {
    if (!values?.groupName) {
      setFieldValue("groupName", "");
      return toast.warn("Please enter group name");
    }
    if (!values?.weight) return toast.warn("Please enter weight");

    const isExist = rowData.find((item) => {
      return (
        item?.strGroupName?.toLowerCase() === values?.groupName?.toLowerCase()
      );
    });

    if (isExist) return toast.warn("Group name already exist");
    const obj = {
      intHeaderId: 0,
      strGroupName: values?.groupName,
      numWeightage: +values?.weight,
      intActionBy: employeeId,
      intAccountId: orgId,
      questionRows: [],
    };
    setRowData([...rowData, obj]);
    setFieldValue("groupName", "");
    setFieldValue("weight", "");
  };

  const [, getQuestionGroupList, questionGroupListLoader] = useAxiosGet();

  useEffect(() => {
    getQuestionGroupList(
      `/PMS/GetQuestionnaireGroupName?accountId=${orgId}`,
      (data) => {
        const modifiedData = data?.map((item) => {
          return {
            ...item,
            enableEdit: false,
          };
        });
        setRowData(modifiedData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {(questionGroupListLoader || loadingAddQuestionnariesGroupName) && (
        <Loading />
      )}
      <div className="add-new-employee-form">
        <div className="row m-0">
          <div className="col-md-6">
            <label>Question Group Name</label>
            <DefaultInput
              classes="input-sm"
              value={values?.groupName}
              name="groupName"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("groupName", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-4">
            <label>Weight</label>
            <DefaultInput
              classes="input-sm"
              value={values?.weight}
              name="weight"
              type="number"
              className="form-control"
              onChange={(e) => {
                setFieldValue("weight", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-2" style={{ marginTop: "21px" }}>
            <button
              type="button"
              className="btn btn-green"
              onClick={() => addhandler(values)}
            >
              Add
            </button>
          </div>
        </div>

        <div className="p-3">
          <p>
            Total weight:{" "}
            {rowData.reduce((acc, curr) => {
              return acc + curr.numWeightage;
            }, 0)}
            <span
              style={{
                color: "red",
                marginLeft: "10px",
              }}
            >
              (Total weight must be 100){" "}
            </span>
          </p>
          <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
            <AntTable
              data={rowData}
              removePagination
              columnsData={createQuestionaireGroupTableColum(
                rowData,
                setRowData
              )}
            />
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
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AddQuestionnariesGroupName;
