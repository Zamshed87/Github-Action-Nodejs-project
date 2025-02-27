import { DeleteOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "../../../../../utility/todayDate";

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

export const handleCreateKpiMapping = (
  typeId,
  rowDto,
  orgId,
  buId,
  employeeId,
  component,
  history,
  setLoading,
  totalDto,
  resetForm,
  cb
) => {
  let payload = (
    rowDto?.length === 0 && totalDto?.length > 0 ? totalDto : rowDto
  )?.map((data) => {
    return {
      kpisMappingId: data?.kpisMappingId || 0,
      accountId: orgId,
      businessUnitId: buId,
      kpisId: data?.kpisId,
      departmentId:
        component === "dept" || component === "designation"
          ? data?.departmentId
          : 0,
      designationId: component === "designation" ? data?.designationId : 0,
      employeeId: component === "employee" ? data?.employeeId : 0,
      weightage: data?.weightage,
      targetFrequency: data?.targetFrequency,
      benchmark: data?.benchmark,
      typeId: typeId,
      isActive: true,
      createdBy: employeeId,
      createdAt: todayDate(),
      updatedBy: employeeId,
      updatedAt: todayDate(),
      kpiForId: 1,
    };
  });

  payload?.length > 0
    ? createNEditKPIMapping(payload, setLoading, cb)
    : toast.warning("Please Add KPI");

  resetForm();
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
  const found = rowDto?.some((item) => {
    return (
      // item?.pmTypeId === values?.pmType?.value &&
      item?.objectiveTypeId === values?.objectiveType?.value &&
      item?.objectiveId === values?.objective?.value &&
      item?.kpisId === values?.kpiName?.value
    );
  });

  if (found) {
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
        designationId: values?.designation?.value,
        designationName: values?.designation?.label,
        employeeId: values?.employee?.value,
        // pmTypeId: values?.pmType?.value,
        // pmTypeName: values?.pmType?.label,
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

export const getKPIsCreateMappingData = async (
  typeId,
  buId,
  orgId,
  deptId,
  empId,
  desgnationId,
  setRowDto,
  setLoading,
  setTotalDto,
  setSecondTableData
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/PMS/GetKpiMappingById?accountId=${orgId}&businessUnitId=${buId}&departmentId=${
        deptId || 0
      }&employeeId=${empId}`
    );
    if (res?.data) {
      const setterData =
        typeId === 1 ? res?.data?.departmentWise : res?.data?.employeeWise;

      setRowDto && setRowDto(Array.isArray(setterData) ? setterData : []);
      setTotalDto && setTotalDto(res?.data);
      setLoading && setLoading(false);
      setSecondTableData &&
        setSecondTableData(
          typeId === 1 ? res?.data?.employeeWise : res?.data?.departmentWise
        );
    }
  } catch (error) {
    setLoading && setLoading(false);
    setRowDto && setRowDto([]);
    setTotalDto && setTotalDto([]);
  }
};

export const kpiMappingColumns = (page, paginationSize, rowDto, setRowDto) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      fixed: "left",
    },
    // {
    //   title: "PM Type",
    //   dataIndex: "pmTypeName",
    // },
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
                const modifiedData = rowDto?.filter(
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

export const kpiColumnDataForViewOnly = (typeId) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      fixed: "left",
    },
    {
      title: "PM Type",
      dataIndex: "pmTypeName",
    },
    {
      title: "Objective Type",
      dataIndex:
        // eslint-disable-next-line eqeqeq
        typeId == 3 ? "departmnetKpiObjectiveTypeName" : "employeeName",
    },
    {
      title: "Objective",
      // eslint-disable-next-line eqeqeq
      dataIndex: typeId == 3 ? "departmnetKpiObjectiveName" : "employeeName",
    },
    {
      title: "KPI Name",
      dataIndex: "kpiName",
      width: "400px",
    },
  ];
};
