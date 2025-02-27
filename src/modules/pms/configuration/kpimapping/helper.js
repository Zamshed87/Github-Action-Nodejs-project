import { CreateOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import * as Yup from "yup";
import AvatarComponent from "../../../../common/AvatarComponent";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

export const initialValues = {
  department: "",
  designation: "",
  employee: "",
  pmType: "",
  objectiveType: "",
  objective: "",
  kpiName: "",
  aggregationType: "",
  kpiMeasurement: "",
  kpiFormat: "",
  weightage: "",
  targetFrequency: "",
  benchmark: "",
};

export const validationSchema = (validateWise) => {
  return Yup.object().shape({
    department:
      validateWise === "dept" &&
      Yup.object()
        .shape({
          label: Yup.string().required("Department is required"),
          value: Yup.string().required("Department is required"),
        })
        .typeError("Department is required"),
    // designation:
    //   validateWise === "designation" &&
    //   Yup.object()
    //     .shape({
    //       label: Yup.string().required("Designation is required"),
    //       value: Yup.string().required("Designation is required"),
    //     })
    //     .typeError("Designation is required"),
    employee:
      validateWise === "employee" &&
      Yup.object()
        .shape({
          label: Yup.string().required("Employee is required"),
          value: Yup.string().required("Employee is required"),
        })
        .typeError("Employee is required"),
    // objectiveType: Yup.object()
    //   .shape({
    //     label: Yup.string().required("Objective Type is required"),
    //     value: Yup.string().required("Objective Type is required"),
    //   })
    //   .typeError("Objective Type is required"),
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
    // weightage: Yup.object()
    //   .shape({
    //     label: Yup.string().required("Weightage is required"),
    //     value: Yup.string().required("Weightage is required"),
    //   })
    //   .typeError("Weightage is required"),
    // targetFrequency: Yup.object()
    //   .shape({
    //     label: Yup.string().required("Target Frequency is required"),
    //     value: Yup.string().required("Target Frequency is required"),
    //   })
    //   .typeError("Target Frequency is required"),
    // benchmark: Yup.string().required("Benchmark is required"),
  });
};

export const getKPIsMappingLanding = async (
  typeId,
  buId,
  orgId,
  deptId,
  empId,
  desgnationId,
  setRowDto,
  setter,
  setLoading,
  pages,
  setPages
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/PMS/GetKpiMappingLanding?typeId=${typeId}&accountId=${orgId}&businessUnitId=${buId}&departmentId=${deptId}&designationId=${desgnationId}&employeeId=${empId}&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`
    );
    if (res?.data) {
      setPages((prev) => ({
        ...prev,
        total: res?.data?.totalCount,
      }));
      setRowDto && setRowDto(res?.data?.data);
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setRowDto && setRowDto([]);
    setter && setter([]);
  }
};

export const employeeeKpiMappingTable = (
  page,
  paginationSize,
  history,
  setSelectedData,
  setShowKpiViewModal
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employeeName}
            />
            <span className="ml-2">{record?.employeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
    },
    {
      title: "Total KPIs",
      dataIndex: "totalKpi",
    },
    {
      title: "Action",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <div className="d-flex align-items-center">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/pms/configuration/kpimapping/employeeWise/edit/3`,
                    {
                      deptName: record?.departmentName,
                      deptId: record?.departmentId,
                      designationName: record?.designationName,
                      designationId: record?.designationId,
                      employeeName: record?.employeeName,
                      employeeId: record?.employeeId,
                    }
                  );
                }}
              >
                <CreateOutlined />
              </button>
            </Tooltip>
            <Tooltip title="View" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedData(record);
                  setShowKpiViewModal(true);
                }}
              >
                <RemoveRedEyeOutlinedIcon />
              </button>
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
};

export const deptKpiMappingTable = (page, paginationSize, history) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
      filter: true,
    },
    {
      title: "Total KPIs",
      dataIndex: "totalKpi",
    },
    {
      title: "Action",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <div className="d-flex align-items-center">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/pms/configuration/kpimapping/departmentWise/edit/1`,
                    {
                      deptName: record?.departmentName,
                      deptId: record?.departmentId,
                      designationName: record?.designationName,
                      designationId: record?.designationId,
                      employeeName: record?.employeeName,
                      employeeId: record?.employeeId,
                    }
                  );
                }}
              >
                <CreateOutlined />
              </button>
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
};

export const designationKpiMappingTable = (page, paginationSize, history) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
      filter: true,
    },
    {
      title: "Total KPIs",
      dataIndex: "totalKpi",
    },
    {
      title: "Action",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <div className="d-flex align-items-center">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/pms/configuration/kpimapping/designationWise/edit/2`,
                    {
                      deptName: record?.departmentName,
                      deptId: record?.departmentId,
                      designationName: record?.designationName,
                      designationId: record?.designationId,
                      employeeName: record?.employeeName,
                      employeeId: record?.employeeId,
                    }
                  );
                }}
              >
                <CreateOutlined />
              </button>
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
};
