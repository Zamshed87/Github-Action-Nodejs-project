import { gray600 } from "../../../../utility/customColor";
import { Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconActionMenuForTable from "../../../../common/IconActionMenuForTable";
import axios from "axios";

export const individualKpiMappingTableColumn = ({
  values,
  history,
  setSelectedData,
  setShowKpiViewModal,
}) => {
  return [
    {
      title: "Sl",
      dataIndex: "sl",
    },
    {
      title: () => <span style={{ color: gray600 }}>Employee Name</span>,
      dataIndex: "employeeName",
    },
    {
      title: "workplace Group",
      dataIndex: "workplaceGroup",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisorName",
    },
    // {
    //   title: "KPI Assigned Type",
    //   dataIndex: "supervisorName",
    // },
    {
      title: "Total KPIs",
      dataIndex: "employeeWiseKpi",
    },
    {
      title: "Action",
      render: (_, record, index) => (
        <div className="d-flex align-items-center justify-content-center">
          <Tooltip title="View" arrow>
            <button
              style={{
                height: "22px",
                fontSize: "11px",
                padding: "0px 10px 0px 10px",
                margin: "0px 5px 0px 5px",
                backgroundColor: "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedData(record);
                setShowKpiViewModal(true);
              }} //
            >
              View
            </button>
          </Tooltip>
          <Tooltip title="Mapping" arrow>
            <button
              style={{
                height: "22px",
                fontSize: "11px",
                padding: "0px 10px 0px 10px",
                margin: "0px 5px 0px 5px",
                backgroundColor: "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                history.push(
                  `/pms/targetsetup/kpimapping/employeeWise/edit/3`,
                  {
                    deptName: record?.departmentName,
                    deptId: record?.departmentId,
                    designationName: record?.designationName,
                    designationId: record?.designationId,
                    employeeName: record?.employeeName,
                    employeeId: record?.employeeId,
                  }
                );
              }} //
            >
              Mapping
            </button>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
      align: "center",
    },
  ];
};

// history.push(
//   `/pms/configuration/kpimapping/departmentWise/edit/1`,
//   {
//     deptName: record?.departmentName,
//     deptId: record?.departmentId,
//     designationName: record?.designationName,
//     designationId: record?.designationId,
//     employeeName: record?.employeeName,
//     employeeId: record?.employeeId,
//   }
// );

export const GetSupervisorDepartmentsAndEmployeesDdl = async (
  empId,
  setDeptDDL,
  setEmpDDL
) => {
  try {
    const response = await axios.get(
      `/PMS/GetSupervisorDepartmentsAndEmployeesDdl?employeeId=${empId}`
    );

    setDeptDDL(response?.data?.departments);
    setEmpDDL(response?.data?.employees);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch supervisor data:", error);
    // supervisorDDL?.reset();
  }
};

export const getSupervisorForAdmin = async (
  supervisorType,
  intAccountId,
  setSupervisorDDL
) => {
  try {
    const response = await axios.get(`/PMS/GetSuporvisorsBySupervisorType`, {
      params: {
        supervisorType: supervisorType || 0,
        accountId: intAccountId || "",
      },
    });

    setSupervisorDDL(response?.data);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch supervisor data:", error);
    // supervisorDDL?.reset();
  }
};
