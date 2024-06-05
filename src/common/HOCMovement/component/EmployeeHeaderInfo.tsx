import { CircularProgress } from "@mui/material";
import { APIUrl } from "App";
import { dateFormatter } from "utility/dateFormatter";
import DemoImg from "../../../assets/images/demo.png";

const EmployeeHeaderInfo = ({
  loadingForInfo,
  progress,
  employeeInfo,
}: {
  loadingForInfo: boolean;
  progress: number;
  employeeInfo: any[];
}) => {
  return (
    <div className="table-card-heading pb-1 pr-0">
      <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
        {loadingForInfo && (
          <CircularProgress
            variant="determinate"
            value={progress}
            sx={{ marginRight: "5px" }}
            color="success"
            size={25}
          />
        )}
        {!loadingForInfo && employeeInfo?.[0]?.strProfileImageUrl ? (
          <img
            src={
              employeeInfo?.[0]?.strProfileImageUrl
                ? `${APIUrl}/Document/DownloadFile?id=${employeeInfo?.[0]?.strProfileImageUrl}`
                : DemoImg
            }
            alt="Profile"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          !loadingForInfo && (
            <img
              src={DemoImg}
              alt="Profile"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )
        )}
        <div className="employeeTitle ml-2 ">
          <p className="employeeName">
            {!loadingForInfo && employeeInfo?.[0]?.EmployeeName
              ? employeeInfo?.[0]?.EmployeeName
              : ""}
          </p>
          <p className="employeePosition">
            {!loadingForInfo && employeeInfo?.[0]?.DesignationName
              ? `${employeeInfo?.[0]?.DesignationName}, ${employeeInfo?.[0]?.EmployeeCode}`
              : ""}
            {!loadingForInfo && employeeInfo?.[0]?.DesignationName
              ? `, Joining Date:  ${dateFormatter(
                  employeeInfo?.[0]?.JoiningDate
                )}`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeaderInfo;
