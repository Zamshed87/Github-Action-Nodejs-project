import { CheckCircle, DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import * as Yup from "yup";
import { gray600 } from "../../../../../utility/customColor";
import DefaultInput from "../../../../../common/DefaultInput";
import { toast } from "react-toastify";

export const questionairesTableColum = ({
  quesitonsList,
  setQuesitonsList,
}) => {
  return [
    {
      title: () => <div style={{ color: gray600 }}>SL</div>,
      render: (_, __, index) => index + 1,
      width: "50px",
    },
    {
      title: () => <div style={{ color: gray600 }}>Question Name</div>,
      width: "250px",
      render: (record) => {
        return <p>{record?.strQuestion}</p>;
      },
    },
    {
      title: () => <div style={{ color: gray600 }}>Reverse Question</div>,
      width: "100px",
      render: (record) => {
        console.log("isReverseQuestion", record?.isReverseQuestion);
        return <p>{record?.isReverseQuestion ? "Yes" : "No"}</p>;
      },
    },
    {
      title: "Action",
      render: (_, __, rowIndex) => (
        <div className="d-flex align-items-center justify-content-center">
          <Tooltip title="Edit" arrow>
            <button
              className="iconButton"
              onClick={(e) => {
                e.stopPropagation();
                const modifiedQuestionsList = quesitonsList.filter(
                  (item, index) => index !== rowIndex
                );
                setQuesitonsList(modifiedQuestionsList);
              }}
            >
              <DeleteOutlined sx={{ fontSize: "20px" }} />
            </button>
          </Tooltip>
        </div>
      ),
      width: "100px",
    },
  ];
};

export const validationSchema = Yup.object({
  questionnairesGroupName: Yup.string().required(
    "Questionnaires Group Name Required"
  ),
});

export const onQuestionaireGroupName = ({
  questionnairesId,
  orgId,
  formValue,
  employeeId,
  addQuestionnariesGroupName,
  onHide,
  resetForm,
}) => {
  const payload = {
    intHeaderId: 0,
    strGroupName: formValue?.questionnairesGroupName || "",
    intActionBy: employeeId,
    intAccountId: orgId,
    questionRows: [],
  };
  addQuestionnariesGroupName?.(
    !questionnairesId ? `/PMS/SaveQuestionnaire` : "",
    payload,
    (data) => {
      onHide?.();
    },
    true
  );
};

// export const createQuestionaireGroupTableColum = {
export const createQuestionaireGroupTableColum = (rowData, setRowData) => {
  return [
    {
      title: () => <div style={{ color: gray600 }}>SL</div>,
      render: (_, __, index) => index + 1,
      width: "30px",
    },
    {
      title: "Group Name",
      dataIndex: "",
      width: "",
      render: (_, data, index) => {
        return (
          <>
            {data?.enableEdit ? (
              <>
                <DefaultInput
                  classes="input-sm"
                  value={data?.strGroupName}
                  name="strGroupName"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    const modifiedRowData = rowData.map((item, i) => {
                      if (i === index) {
                        return {
                          ...item,
                          strGroupName: e.target.value,
                        };
                      }
                      return item;
                    });
                    setRowData(modifiedRowData);
                  }}
                />
              </>
            ) : (
              <p>{data?.strGroupName}</p>
            )}
          </>
        );
      },
    },
    {
      title: "Weight",
      dataIndex: "",
      render: (_, data, index) => {
        return (
          <>
            {data?.enableEdit ? (
              <>
                <DefaultInput
                  classes="input-sm"
                  value={data?.numWeightage}
                  name="numWeightage"
                  type="number"
                  className="form-control"
                  onChange={(e) => {
                    const modifiedRowData = rowData.map((item, i) => {
                      if (i === index) {
                        return {
                          ...item,
                          numWeightage: +e.target.value,
                        };
                      }
                      return item;
                    });
                    setRowData(modifiedRowData);
                  }}
                />
              </>
            ) : (
              <p>{data?.numWeightage}</p>
            )}
          </>
        );
      },
      width: "100px",
      className: "text-center",
    },
    {
      title: "Action",
      dataIndex: "",
      width: "100px",
      className: "text-center",
      render: (_, data, index) => {
        return (
          <div className="d-flex justify-content-center justify-items-center">
            {data?.enableEdit ? (
              <IconButton
                title="Update"
                onClick={() => {
                  const modifiedRowData = rowData.map((item, i) => {
                    if (i === index) {
                      return {
                        ...item,
                        enableEdit: false,
                      };
                    }
                    return item;
                  });
                  setRowData(modifiedRowData);
                }}
              >
                <CheckCircle />
              </IconButton>
            ) : (
              <IconButton
                title="Edit"
                onClick={() => {
                  const modifiedRowData = rowData.map((item, i) => {
                    if (i === index) {
                      return {
                        ...item,
                        enableEdit: true,
                      };
                    }
                    return item;
                  });
                  setRowData(modifiedRowData);
                }}
              >
                <EditOutlined />
              </IconButton>
            )}
            <IconButton
              title="Delete"
              onClick={() => {
                if (data?.questionRows?.length > 0) {
                  return toast.warn(
                    "There are some questionnaries in this group. Please delete the questions first."
                  );
                } else {
                  const modifiedRowData = rowData.filter(
                    (item, i) => i !== index
                  );
                  setRowData(modifiedRowData);
                }
              }}
            >
              <DeleteOutlined />
            </IconButton>
          </div>
        );
      },
    },
  ];
};

export const onUpdateQuestionGroupNameAndQuestion = ({
  employeeId,
  questionGroupId,
  formValues,
  quesitonsList,
  orgId,
  updateQuestionnariesGroupNameAndQUestions,
  onHide,
  resetForm,
}) => {
  const payload = {
    intHeaderId: questionGroupId,
    strGroupName: formValues?.questionnairesGroupName || "",
    intActionBy: employeeId,
    intAccountId: orgId,
    questionRows: quesitonsList,
  };

  updateQuestionnariesGroupNameAndQUestions(
    `/PMS/SaveQuestionnaire`,
    payload,
    (data) => {
      if (data?.statusCode === 200) {
        onHide?.();
        resetForm?.();
      }
    },
    true
  );
};
