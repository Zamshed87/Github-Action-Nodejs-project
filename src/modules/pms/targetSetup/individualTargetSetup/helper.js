import axios from "axios";
import moment from "moment";
import { gray600 } from "../../../../utility/customColor";
import { Tooltip } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const getFiscalYearForNowOnLoad = () => {
  const monthYear = moment().format("MM-YYYY");
  let theYear;
  if (monthYear.split("-")[0] < 6) {
    let prevYear = moment(monthYear, "MM-YYYY")
      .subtract(1, "years")
      .format("YYYY");
    theYear = prevYear + "-" + monthYear.split("-")[1];
  } else {
    theYear =
      monthYear.split("-")[1] + "-" + (Number(monthYear.split("-")[1]) + 1);
  }
  return theYear;
};

export const getAsyncEmployeeCommonApi = async ({
  orgId,
  buId,
  intId,
  value,
  minSearchLength = 3,
}) => {
  if (value?.length < minSearchLength) return;
  try {
    const response = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoSearchDDL&AccountId=${
        orgId || 0
      }&BusinessUnitId=${buId || 0}&intId=${intId || 0}&SearchText=${
        value || ""
      }`
    );
    const modifiedEmployeeDDL = Array.from(response?.data, (item) => ({
      ...item,
      value: item?.EmployeeId,
      label: item?.EmployeeName,
    }));
    return modifiedEmployeeDDL;
  } catch (_) {
    return [];
  }
};

export const individualtargetSetupTableColumn = ({ values, history }) => {
  return [
    {
      title: "Sl",
      dataIndex: "sl",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeId",
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
      title: "Action",
      render: (_, record, index) => (
        <div className="d-flex align-items-center justify-content-center">
          <Tooltip title="Edit" arrow>
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                backgroundColor: "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                history?.push({
                  pathname: `/pms/targetsetup/EmployeeTarget/edit/${record?.employeeId}`,
                  state: {
                    isEdit: true,
                    empInfo: record,
                    prevlandingValues: values,
                  },
                });
              }} //
            >
              Target
            </button>
            {/* <button
              className="iconButton mx-2"
              onClick={(e) => {
                e.stopPropagation();
                history?.push({
                  pathname: `/pms/targetsetup/EmployeeTarget/edit/${record?.employeeId}`,
                  state: {
                    isEdit: true,
                    empInfo: record,
                    prevlandingValues: values,
                  },
                });
              }}
            >
              Target
            </button> */}
          </Tooltip>
          <Tooltip title="View" arrow>
            <button
              type="button"
              className="iconButton mt-0 mt-md-2 mt-lg-0 mx-2"
              onClick={(e) => {
                e.stopPropagation();
                history?.push({
                  pathname: `/pms/targetsetup/EmployeeTarget/view/${record?.employeeId}`,
                  state: {
                    isEdit: false,
                    empInfo: record,
                    prevlandingValues: values,
                  },
                });
              }}
            >
              <VisibilityIcon />
            </button>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];
};

export const onChangeTargetFrequency = ({
  valueOption,
  values,
  setTargetList,
  year,
}) => {
  if (valueOption?.value === "Monthly") {
    let startMonth = moment(`Jun, ${year?.split("-")[0]}`, "MMM, YYYY");
    let next12Months = [];
    for (let i = 0; i < 12; i++) {
      next12Months.push({
        id: i + 1,
        intTargetId: null,
        intKPIsId: null,
        intYearId: i + 1,
        strYearName: null,
        numTarget: null,
        numAchivement: null,
        intFrequencyValue: 1,
        strTargetFrequency: "",
        intKPIForId: null,
        intEmployeeId: null,
        departmentId: null,
        intBusinessUnitId: null,
        strFrequencyValue: startMonth.add(1, "month").format("MMM, YYYY"),
      });
    }
    setTargetList(next12Months);
  } else if (valueOption?.value === "Quarterly") {
    let quarters = [];
    for (let i = 0; i < 4; i++) {
      quarters.push({
        id: i + 1,
        intTargetId: null,
        intKPIsId: null,
        intYearId: i + 1,
        strYearName: null,
        numTarget: null,
        numAchivement: null,
        intFrequencyValue: 1,
        strTargetFrequency: "",
        intKPIForId: null,
        intEmployeeId: null,
        departmentId: null,
        intBusinessUnitId: null,
        strFrequencyValue: `Quarter-${i + 1}`,
      });
    }
    setTargetList(quarters);
  } else if (valueOption?.value === "Yearly") {
    setTargetList([
      {
        id: 1,
        intTargetId: null,
        intKPIsId: null,
        intYearId: 1,
        strYearName: null,
        numTarget: null,
        numAchivement: null,
        intFrequencyValue: 1,
        strTargetFrequency: "",
        intKPIForId: null,
        intEmployeeId: null,
        departmentId: null,
        intBusinessUnitId: null,
        strFrequencyValue: year,
      },
    ]);
  } else {
    setTargetList([]);
  }
};
