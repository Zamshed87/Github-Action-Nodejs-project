import { Tooltip } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { toast } from "react-toastify";
import { gray600 } from "../../../../utility/customColor";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import IConfirmModal from "../../../../common/IConfirmModal";
import * as Yup from "yup";

export const onGetObjectiveLanding = ({
  getObjectiveLanding,
  orgId,
  setObjectiveTableData,
  pages,
  setPages,
}) => {
  getObjectiveLanding?.(
    `/PMS/GetPMSObejctiveLanding?accountId=${orgId}&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
    (data) => {
      setPages?.((prev) => ({
        ...prev,
        total: data?.totalCount,
      }));
      data?.data?.length && setObjectiveTableData?.(data?.data);
    }
  );
};

export const onAddObjective = ({
  formValues,
  objectiveList,
  buId,
  orgId,
  employeeId,
  setObjectiveList,
  location,
  createOrEditObjective,
  resetForm,
  initialValues,
  history,
}) => {
  if (formValues?.pmType?.value === 1 && !formValues?.objectiveType)
    return toast.warn("Objective type is required for BSC");
  let found = false;
  if (formValues?.objectiveIndex != null) {
    let foundedList = objectiveList?.filter(
      (item, index) =>
        index !== formValues?.objectiveIndex &&
        item?.pmtypeId === formValues?.pmType?.value &&
        item?.objectiveTypeId === formValues?.objectiveType?.value &&
        item?.objective === formValues?.objective
    );
    if (foundedList?.length > 0) {
      found = true;
    }
  } else {
    found = objectiveList?.some(
      (item) =>
        item?.pmtypeId === formValues?.pmType?.value &&
        item?.objectiveTypeId === formValues?.objectiveType?.value &&
        item?.objective === formValues?.objective
    );
  }
  if (found) return toast.warn("Can't add duplicate objective");
  const newObjectiveObj = {
    objectiveId: location?.state?.objectiveId
      ? location?.state?.objectiveRow?.objectiveId
      : 0,
    objectiveCode: location?.state?.objectiveId
      ? location?.state?.objectiveRow?.objectiveCode
      : "",
    objective: formValues?.objective,
    pMTypeName: formValues?.pmType?.label,
    pmtypeId: formValues?.pmType?.value,
    objectiveTypeName: formValues?.objectiveType?.label,
    objectiveTypeId: formValues?.objectiveType?.value,
    description: formValues?.description,
    isActive: true,
    accountId: location?.state?.objectiveId
      ? location?.state?.objectiveRow?.accountId
      : orgId,
    createdBy: location?.state?.objectiveId
      ? location?.state?.objectiveRow?.createdBy
      : employeeId,
    updatedBy: location?.state?.objectiveId ? employeeId : 0,
  };
  if (formValues?.objectiveIndex != null) {
    const modifiedObjectiveList = objectiveList?.map((item, index) =>
      index === formValues?.objectiveIndex ? newObjectiveObj : item
    );
    setObjectiveList?.(modifiedObjectiveList);
  } else if (!location?.state?.objectiveId) {
    setObjectiveList?.((prev) => [...(prev || []), newObjectiveObj]);
  }
  if (location?.state?.objectiveId) {
    onCreateOrEditObjective?.({
      createOrEditObjective,
      objectiveList: [newObjectiveObj],
      history,
      location,
    });
    return;
  }
  resetForm?.(initialValues);
};

export const onCreateOrEditObjective = ({
  createOrEditObjective,
  objectiveList,
  setObjectiveList,
  history,
  location,
}) => {
  createOrEditObjective?.(
    `/PMS/SavePMSObjective`,
    objectiveList,
    () => {
      if (location?.state?.objectiveId) {
        history.goBack();
        return;
      }
      setObjectiveList && setObjectiveList([]);
    },
    true
  );
};

export const pmsObjectiveTableColumn = ({
  fromLanding,
  history,
  permission,
  setValues,
  objectiveList,
  setObjectiveList,
  deletePMSObjective,
  getObjectiveLanding,
  orgId,
  employeeId,
  setObjectiveTableData,
  pages,
}) => {
  return [
    {
      title: () => <span style={{ color: gray600 }}>SL</span>,
      dataIndex: "sl",
      sorter: false,
      className: "text-center",
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Objective",
      dataIndex: "objective",
      sorter: true,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Description</span>,
      dataIndex: "description",
    },
    {
      title: "PM Type",
      dataIndex: fromLanding ? "pmTypeName" : "pMTypeName",
      sorter: true,
      filter: true,
      width: 100,
    },
    {
      title: "Objective Type",
      dataIndex: "objectiveTypeName",
      sorter: true,
      width: 150,
    },
    fromLanding
      ? {
          title: "Objective Code",
          dataIndex: "objectiveCode",
          sorter: true,
          filter: true,
          width: 150,
        }
      : {},
    {
      title: "Action",
      render: (_, record, index) => (
        <div className="d-flex align-items-center justify-content-start">
          <Tooltip title="Edit" arrow>
            <button
              className="iconButton mx-2"
              onClick={(e) => {
                e.stopPropagation();
                if (fromLanding) {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  history?.push({
                    pathname: "/pms/configuration/objective/edit",
                    state: {
                      objectiveId: record?.objectiveId,
                      objectiveRow: record,
                    },
                  });
                }
                setValues?.((prev) => ({
                  ...prev,
                  objectiveIndex: index,
                  pmType: {
                    label: record?.pMTypeName,
                    value: record?.pmtypeId,
                  },
                  objectiveType: {
                    label: record?.objectiveTypeName,
                    value: record?.objectiveTypeId,
                  },
                  objective: record?.objective,
                  description: record?.description,
                }));
              }}
            >
              <EditOutlined sx={{ fontSize: "20px" }} />
            </button>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <button
              type="button"
              className="iconButton mt-0 mt-md-2 mt-lg-0 mx-2"
              onClick={(e) => {
                e.stopPropagation();
                if (fromLanding) {
                  let confirmObject = {
                    closeOnClickOutside: false,
                    message: "Are you sure want to delete this objective?",
                    yesAlertFunc: () => {
                      deletePMSObjective?.(
                        `/PMS/DeletePMSObjective?AccountId=${record?.accountId}&ObjectiveId=${record?.objectiveId}&UserId=${employeeId}`,
                        null,
                        () => {
                          onGetObjectiveLanding?.({
                            getObjectiveLanding,
                            orgId,
                            setObjectiveTableData,
                          });
                        },
                        true
                      );
                    },
                    noAlertFunc: () => {},
                  };
                  IConfirmModal(confirmObject);
                } else {
                  const modifiedObjectiveList = objectiveList?.filter(
                    (__, nestedIndex) => nestedIndex !== index
                  );
                  setObjectiveList?.(modifiedObjectiveList);
                }
              }}
            >
              <DeleteOutlineOutlined />
            </button>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];
};

export const setObjectiveToInitDataOnEditFromLanding = ({
  location,
  setValues,
}) => {
  const { objectiveRow } = location?.state;
  setValues?.((prev) => ({
    ...prev,
    pmType: {
      label: objectiveRow?.pmTypeName,
      value: objectiveRow?.pmtypeId,
    },
    objectiveType: {
      value: objectiveRow?.objectiveTypeId,
      label: objectiveRow?.objectiveTypeName,
    },
    objective: objectiveRow?.objective,
    description: objectiveRow?.description,
  }));
};

export const validationSchemaOfObjectiveCreate = () => {
  const validationSchema = Yup.object().shape({
    pmType: Yup.object({
      label: Yup.string()
        .required("PM type is required")
        .typeError("Invalid PM type"),
      value: Yup.number()
        .required("PM type is required")
        .typeError("Invalid PM type"),
    })
      .required("PM type is required")
      .typeError("PM type is required"),
    objective: Yup.string()
      .required("Objective is required")
      .typeError("Objective is required"),
  });
  return validationSchema;
};

export const excelHeaderForObjective = ({ businessUnit, title }) => {
  return [
    {
      text: businessUnit,
      fontSize: 18,
      bold: true,
      cellRange: "A1:E1",
      merge: true,
      alignment: "center:middle",
    },
    {
      text: title,
      fontSize: 18,
      bold: true,
      cellRange: "A1:E1",
      merge: true,
      alignment: "center:middle",
    },
    {
      text: "",
      fontSize: 18,
      bold: true,
      cellRange: "A1:E1",
      merge: true,
      alignment: "center:middle",
    },
  ];
};

export const excelTableHeaderForObjective = () => {
  return [
    {
      text: "SL",
      fontSize: 8.5,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Objective Code",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Objective",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Description",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "PM Type",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Objective Type",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
  ];
};

class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 9,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
    };
  }
}

export const excelTableRowForObjective = ({ rowData }) => {
  const data = rowData?.map((item, index) => {
    return [
      new Cell(
        !item?.isTotal ? String(index + 1) : "",
        "center",
        "text"
      ).getCell(),
      new Cell(
        item?.isTotal ? "" : item?.objectiveCode || "N/A",
        "left",
        "text"
      ).getCell(),
      new Cell(
        item?.isTotal ? "" : item?.objective || "N/A",
        "center",
        "text"
      ).getCell(),
      new Cell(
        item?.isTotal ? "" : item?.description || "N/A",

        "left",
        "text"
      ).getCell(),
      new Cell(
        item?.isTotal ? "" : item?.pmTypeName || "N/A",

        "left",
        "text"
      ).getCell(),
      new Cell(
        item?.isTotal ? "" : item?.objectiveTypeName || "N/A",

        "left",
        "text"
      ).getCell(),
    ];
  });
  return data;
};
