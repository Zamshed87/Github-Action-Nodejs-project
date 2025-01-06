import { Divider } from "@mui/material";
import { APIUrl } from "App";
import CommonEmpInfo from "common/CommonEmpInfo";
import { DataTable } from "Components";
import { shallowEqual, useSelector } from "react-redux";
import profileImg from "assets/images/profile.jpg";
import moment from "moment";

const PopoverHistory = ({ propsObj }) => {
  //   console.log(propsObj);
  //   const [monthYear, setMonthYear] = useState(moment().format("YYYY-MM"));
  //   const [loading, setLoading] = useState(false);

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { selectedSingleEmployee, offDayHistory, setOffDayHistory } = propsObj;
  const header = [
    {
      title: "Sl",
      render: (_, record, index) => index + 1,
      width: 25,
    },
    {
      title: "Calendar",
      dataIndex: "StrCalendarName",
      width: 45,
    },
    {
      title: "Attendance Date",
      dataIndex: "dteAttendanceDate",

      render: (data) => (data ? moment(data).format("l") : "N/A"),

      width: 40,
    },
  ];
  return (
    <div>
      <div className="d-flex align-items-center my-3">
        <img
          className="ml-3"
          src={
            selectedSingleEmployee[0]?.profileImageUrl
              ? `${APIUrl}/Document/DownloadFile?id=${selectedSingleEmployee[0]?.profileImageUrl}`
              : profileImg
          }
          alt=""
          style={{ maxHeight: "78px", minWidth: "78px" }}
        />
        <CommonEmpInfo
          employeeName={selectedSingleEmployee[0]?.StrEmployeeName}
          designationName={selectedSingleEmployee[0]?.StrDesignation}
          departmentName={selectedSingleEmployee[0]?.StrDepartmentName}
        />
      </div>
      <Divider sx={{ my: "8px !important" }} />
      <div className="px-3 pb-3">
        <DataTable
          header={header}
          nodataStyle={{ marginTop: "-35px", height: "175px" }}
          // bordered
          data={offDayHistory?.length > 0 ? offDayHistory : []}
        />{" "}
      </div>
    </div>
  );
};

export default PopoverHistory;
