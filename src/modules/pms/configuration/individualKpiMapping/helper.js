import { gray600 } from "../../../../utility/customColor";
import { Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconActionMenuForTable from "../../../../common/IconActionMenuForTable";

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
      title: "Department",
      dataIndex: "departmentName",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
    },
    {
      title: "Total KPIs",
      dataIndex: "totalKpiNew",
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
              }} //
            >
              Mapping
            </button>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];
};
