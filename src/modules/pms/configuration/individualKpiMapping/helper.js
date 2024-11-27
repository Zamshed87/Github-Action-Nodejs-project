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
              type="button"
              className="iconButton mt-0 mt-md-2 mt-lg-0 mx-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedData(record);
                setShowKpiViewModal(true);
              }}
            >
              <VisibilityIcon />
            </button>
          </Tooltip>
          <button
            type="button"
            className="iconButton mt-0 mt-md-2 mt-lg-0 mx-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <IconActionMenuForTable
              options={[
                {
                  value: 1,
                  label: "Employee Wise",
                  onClick: () => {
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
                  },
                },
                {
                  value: 2,
                  label: "Department Wise",
                  onClick: () => {
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
                  },
                },
              ]}
            />
          </button>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];
};
