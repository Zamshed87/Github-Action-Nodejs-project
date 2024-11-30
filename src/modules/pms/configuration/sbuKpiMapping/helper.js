/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { toast } from "react-toastify";
import { gray600 } from "../../../../utility/customColor";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import IConfirmModal from "../../../../common/IConfirmModal";
import { DeleteOutlined } from "@mui/icons-material";
import * as Yup from "yup";
import { todayDate } from "../../../../utility/todayDate";
import axios from "axios";
export const onGetObjectiveLanding = ({
  getObjectiveLanding,
  orgId,
  buId,
  setObjectiveTableData,
  setLoading,
  pages,
  setPages,
}) => {
  setLoading && setLoading(true);
  getObjectiveLanding?.(
    `/PMS/GetDepartmentAndSbuKPILanding?KPIForId=3&accountId=${orgId}&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
    (data) => {
      setPages((prev) => ({
        ...prev,
        total: data?.totalCount,
      }));
      setObjectiveTableData?.(data?.data);
      setLoading && setLoading(false);
    }
  );
  setLoading && setLoading(false);
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
export const pmsSBUKPITableColumn = ({
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
}) => {
  return [
    {
      title: () => <span style={{ color: gray600 }}>SL</span>,
      render: (_, __, index) => index + 1,
      sorter: false,
      className: "text-center",
      width: "50px",
      filter: false,
    },
    {
      title: "Sbu Name",
      dataIndex: "businessUnitName",
      sorter: true,
      filter: true,
    },
    // {
    //   title: "Weightage",
    //   dataIndex: "weightage",
    //   sorter: true,
    //   filter: true,
    // },
    // {
    //   title: "Benchmark",
    //   dataIndex: "benchmark",
    //   sorter: true,
    //   filter: true,
    // },
    {
      title: "Total Kpi",
      dataIndex: "totalKpi",
      sorter: true,
      filter: true,
    },
    {
      title: "Action",
      render: (_, record, index) => (
        <div className="d-flex align-items-center justify-content-center">
          <Tooltip title="Edit" arrow>
            <button
              className="iconButton mx-2"
              onClick={(e) => {
                e.stopPropagation();
                if (fromLanding) {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  history?.push({
                    pathname: "/pms/configuration/subkpimapping/edit",
                    state: {
                      sbuId: record?.businessUnitId,
                      sbu: record?.businessUnitName,
                      sbuRow: record,
                    },
                  });
                }
              }}
            >
              <EditOutlined sx={{ fontSize: "20px" }} />
            </button>
          </Tooltip>
          {/* <Tooltip title="Delete" arrow>
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
          </Tooltip> */}
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
    objectiveType: Yup.object({
      label: Yup.string()
        .required("Objective type is required")
        .typeError("Invalid Objective type"),
      value: Yup.number()
        .required("Objective type is required")
        .typeError("Invalid Objective type"),
    })
      .required("Objective type is required")
      .typeError("Objective type is required"),
    objective: Yup.string()
      .required("Objective is required")
      .typeError("Objective is required"),
  });
  return validationSchema;
};

export const targetFrequency = [
  {
    label: "Monthly",
    value: "Monthly",
  },
  {
    label: "Quarterly",
    value: "Quarterly",
  },
  {
    label: "Yearly",
    value: "Yearly",
  },
];

export const weightage = () => {
  let arr = [];
  for (let i = 1; i <= 70; i++) {
    arr.push({
      label: i,
      value: i,
    });
  }
  return arr;
};

export const kpiMappingColumns = (page, paginationSize, rowDto, setRowDto) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      fixed: "left",
    },
    {
      title: "PM Type",
      dataIndex: "pmTypeName",
    },
    {
      title: "Objective Type",
      dataIndex: "objectiveTypeName",
    },
    {
      title: "Objective",
      dataIndex: "objectiveName",
    },
    {
      title: "KPI Name",
      dataIndex: "kpiName",
      width: "400px",
    },
    // {
    //   title: "Weightage",
    //   dataIndex: "weightage",
    // },
    // {
    //   title: "Target Frequency",
    //   dataIndex: "targetFrequency",
    // },
    // {
    //   title: "Benchmark",
    //   dataIndex: "benchmark",
    // },
    {
      title: "Action",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <Tooltip title="Delete" arrow>
            <button
              type="button"
              className="iconButton mt-0 mt-md-2 mt-lg-0"
              onClick={() => {
                const modifiedData = rowDto.filter(
                  (item, filteredindex) => filteredindex !== index
                );
                setRowDto(modifiedData);
              }}
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </>
      ),
      width: "100px",
    },
  ];
};

export const saveHandler = (
  params,
  rowDto,
  values,
  setRowDto,
  strBusinessUnit,
  setValues,
  resetForm
) => {
  const isDuplicate = rowDto?.some((item) => {
    return (
      item?.pmTypeId === values?.pmType?.value &&
      item?.objectiveTypeId === values?.objectiveType?.value &&
      item?.objectiveId === values?.objective?.value &&
      item?.kpisId === values?.kpiName?.value
    );
  });

  if (isDuplicate) {
    return toast.warn("Can't add duplicate Data");
  } else {
    setRowDto([
      ...rowDto,
      {
        businessUnitName: strBusinessUnit,
        employeeCode: values?.employee?.code,
        employeeName: values?.employee?.label,
        departmentId: values?.department?.value,
        departmentName: values?.department?.label,
        kpisId: values?.kpiName?.value,
        kpiName: values?.kpiName?.label,
        sbuId: values?.businessUnit?.value,
        sbu: values?.businessUnit?.label,
        employeeId: values?.employee?.value,
        pmTypeId: values?.pmType?.value,
        pmTypeName: values?.pmType?.label,
        objectiveTypeId: values?.objectiveType?.value,
        objectiveTypeName: values?.objectiveType?.label,
        objectiveId: values?.objective?.value,
        objectiveName: values?.objective?.label,
        weightage: values?.weightage?.value || 0,
        targetFrequency: values?.targetFrequency?.value || "",
        benchmark: values?.benchmark || 0,
      },
    ]);
  }
};

export const validationSchema = () => {
  return Yup.object().shape({
    businessUnit: Yup.object()
      .shape({
        label: Yup.string().required("Business Unit is required"),
        value: Yup.string().required("Business Unit is required"),
      })
      .typeError("Business Unit is required"),
    pmType: Yup.object()
      .shape({
        label: Yup.string().required("PM Type is required"),
        value: Yup.string().required("PM Type is required"),
      })
      .typeError("PM Type is required"),
    objective: Yup.object()
      .shape({
        label: Yup.string().required("Objective is required"),
        value: Yup.string().required("Objective is required"),
      })
      .typeError("Objective is required"),
    kpiName: Yup.object()
      .shape({
        label: Yup.string().required("KPI Name is required"),
        value: Yup.string().required("KPI Name is required"),
      })
      .typeError("KPI Name is required"),
  });
};

export const handleCreateKpiMapping = ({
  typeId,
  rowDto,
  orgId,
  buId,
  employeeId,
  setLoading,
  totalDto,
  resetForm,
  cb,
}) => {
  let payload = (
    rowDto?.length === 0 && totalDto?.length > 0 ? totalDto : rowDto
  )?.map((data) => {
    return {
      kpisMappingId: data?.kpisMappingId || 0,
      accountId: orgId,
      businessUnitId: data?.businessUnitId || data?.sbuId,
      kpisId: data?.kpisId,
      departmentId: 0,
      designationId: 0,
      employeeId: 0,
      weightage: data?.weightage,
      targetFrequency: data?.targetFrequency,
      benchmark: data?.benchmark,
      typeId: typeId,
      isActive: true,
      createdBy: employeeId,
      createdAt: todayDate(),
      updatedBy: employeeId,
      updatedAt: todayDate(),
      kpiForId: 3,
    };
  });

  payload?.length > 0
    ? createNEditKPIMapping(payload, setLoading, cb)
    : toast.warning("Please Add KPI");

  resetForm();
};

export const createNEditKPIMapping = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/PMS/SaveKpiMapping`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getKPIsCreateMappingData = async ({
  orgId,
  sbuId,
  setRowDto,
  setLoading,
  setTotalDto,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/PMS/GetAllDepartmentAndSbuKPIData?KPIForId=3&accountId=${orgId}&businessUnitId=${sbuId}`
    );
    if (res?.data) {
      setRowDto && setRowDto(res?.data);
      setTotalDto && setTotalDto(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setRowDto && setRowDto([]);
    setTotalDto && setTotalDto([]);
  }
};
