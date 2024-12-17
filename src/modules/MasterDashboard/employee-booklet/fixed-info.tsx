import { APIUrl } from "App";
import profileImg from "../../../assets/images/profile.jpg";
import { Divider, Tag } from "antd";
import moment from "moment";

const FixedInfo = ({ singleData }: any) => {
  const getChipData = (statusId: any) => {
    switch (statusId) {
      case "Active":
        return { label: "Active", class: "success" };
      case "Inactive":
        return { label: "Inactive", class: "danger" };
      case "Retired":
        return { label: "Retired", class: "warning" };
      case "Salary Hold":
        return { label: "Salary Hold", class: "hold" };
      default:
        return { label: "", class: "" };
    }
  };

  return (
    <div>
      <center className="mt-2">
        {singleData?.intEmployeeImageUrlId &&
        singleData?.intEmployeeImageUrlId > 0 ? (
          <img
            src={`${APIUrl}/Document/DownloadFile?id=${singleData?.intEmployeeImageUrlId}`}
            alt=""
            style={{
              maxHeight: "150px",
              minWidth: "140px",
              borderRadius: "4px",
            }}
          />
        ) : (
          <img
            src={profileImg}
            alt="iBOS"
            style={{ height: "inherit", borderRadius: "4px" }}
          />
        )}
      </center>
      <center className="mt-2">
        <h1 style={{ fontSize: "18px", fontWeight: 700 }}>
          {singleData?.strEmployeeName}
        </h1>
        <h1 style={{ fontSize: "14px", marginTop: "1px" }}>
          {singleData?.strDesignation}
        </h1>
        <h1 style={{ fontSize: "14px", marginTop: "1px" }}>
          {singleData?.strDepartment}
        </h1>
        <Tag
          style={{ borderRadius: "50px", fontWeight: 600 }}
          className={getChipData(singleData?.strEmployeeStatus).class}
        >
          {getChipData(singleData?.strEmployeeStatus).label}
        </Tag>
      </center>
      <Divider style={{ margin: "5px 0", backgroundColor: "lightgray" }} />
      <div style={{ fontSize: "12px" }}>
        <div className="mt-2">
          Workplace Group :{" "}
          <div style={{ fontWeight: "500" }}>
            {singleData?.strWorkplaceGroupName}
          </div>
        </div>
        <div className="mt-2">
          Workplace :{" "}
          <div style={{ fontWeight: "500" }}>
            {singleData?.strWorkplaceName}
          </div>
        </div>
        <div className="mt-2">
          Employee Code :{" "}
          <div style={{ fontWeight: "500" }}>{singleData?.strEmployeeCode}</div>
        </div>
        <div className="mt-2">
          Joining Date :{" "}
          <div style={{ fontWeight: "500" }}>
            {moment(singleData?.dteJoiningDate).format("DD MMM, YYYY")}
          </div>
        </div>
        <div className="mt-2">
          Service Length :{" "}
          <div style={{ fontWeight: "500" }}>
            {singleData?.strServiceLength}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedInfo;
