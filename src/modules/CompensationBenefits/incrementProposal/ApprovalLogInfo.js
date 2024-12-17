import { Divider } from "@mui/material";
import moment from "moment";
import { DataTable } from "Components";
import CommonEmpInfo from "common/CommonEmpInfo";
import { APIUrl } from "App";

const PopoverHistory = ({ propsObj }) => {
  const { selectedSingleEmployee, profileImg } = propsObj;
  const header = [
    {
      title: "Sl",
      render: (_, record, index) => index + 1,
      width: 25,
    },
    {
      title: "Approver",
      dataIndex: "approverName",
      width: 45,
    },
    {
      title: "Proposed Amount",
      dataIndex: "incrementProposalAmount",
      width: 45,
    },
    {
      title: "Proposed Percentage",
      dataIndex: "incrementProposalPercentage",
      width: 50,
    },
    {
      title: "Approved Date",
      dataIndex: "approvedDate",

      render: (data) => (data ? moment(data).format("l") : "N/A"),

      width: 50,
    },
    {
      title: "Comments",
      dataIndex: "coments",
      width: 50,
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdDate",

    //   //   render: (data) =>
    //   //     data?.createdDate ? moment(data?.createdDate).format("l") : "N/A",

    //   width: 40,
    // },
    {
      title: "Status",
      dataIndex: "ststusTitle",

      //   render: (data) =>
      //     data?.createdDate ? moment(data?.createdDate).format("l") : "N/A",

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
          employeeName={selectedSingleEmployee?.employeeName}
          designationName={selectedSingleEmployee?.designationName}
          departmentName={selectedSingleEmployee?.departmentName}
        />
      </div>
      <Divider sx={{ my: "8px !important" }} />
      <div className="px-3 pb-3">
        <DataTable
          header={header}
          nodataStyle={{ marginTop: "-35px", height: "175px" }}
          // bordered
          data={selectedSingleEmployee?.approvalLog}
        />{" "}
      </div>
    </div>
  );
};

export default PopoverHistory;
