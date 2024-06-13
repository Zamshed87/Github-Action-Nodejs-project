/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, styled, tooltipClasses } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import MuiIcon from "../../../../common/MuiIcon";
import { gray600, gray900, greenColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
export const getWithdrawalListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/PFWithdrawLandingEngine`,
      payload
    );
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const withdrawalApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/PFWithdrawApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const pfWithdrawApprovalLandingTableColumn = (propsObj) => {
  const {
    orgId,
    employeeId,
    isOfficeAdmin,
    setFieldValue,
    applicationListData,
    setApplicationListData,
    setAllData,
    setLoading,
    page,
    paginationSize,
    allData
  } = propsObj;
  return [
    {
      title: () => <span style={{ color: gray600 }}>SL</span>,
      render: (_, __, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: () => (
        <FormikCheckBox
          styleObj={{
            margin: "0 auto!important",
            color: gray900,
            checkedColor: greenColor,
          }}
          name="allSelected"
          checked={
            applicationListData?.listData?.length > 0 &&
            applicationListData?.listData?.every((item) => item?.selectCheckbox)
          }
          onChange={(e) => {
            setApplicationListData({
              listData: applicationListData?.listData?.map((item) => ({
                ...item,
                selectCheckbox: e.target.checked,
              })),
            });
            setAllData({
              listData: allData?.listData?.map((item) => ({
                ...item,
                selectCheckbox: e.target.checked,
              })),
            });
            
            setFieldValue("allSelected", e.target.checked);
          }}
        />
      ),
      className: "text-center",
      render: (_, __, i) => (
        <FormikCheckBox
          styleObj={{
            margin: "0 0 0 1px",
            color: gray900,
            checkedColor: greenColor,
          }}
          name="selectCheckbox"
          color={greenColor}
          checked={applicationListData?.listData[i]?.selectCheckbox}
          onChange={(e) => {
            let data = [...applicationListData?.listData];
            data[i].selectCheckbox = e.target.checked;
            setApplicationListData({ listData: [...data] });
            let data2 = [...allData?.listData];
            data2[i].selectCheckbox = e.target.checked;
            setAllData({ listData: [...data2] });
          }}
        />
      ),
    },
    {
      title: "Code",
      dataIndex: "employeeCode",
      sorter: true,
    },
    {
      title: "Employee",
      dataIndex: "strEmployee",
      render: (_, data) => (
        <div className="employeeInfo d-flex align-items-center">
          <AvatarComponent letterCount={1} label={data?.strEmployee} />
          <div className="employeeTitle ml-2">
            <div>{data?.strEmployee}</div>
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Application Date</span>,
      render: (_, data) => (
        <div>
          {data?.application?.dteApplicationDate
            ? dateFormatter(data?.application?.dteApplicationDate)
            : "N/A"}
        </div>
      ),
    },
    {
      title: () => <span style={{ color: gray600 }}>Withdraw Amount</span>,
      render: (_, data) => (
        <div className="d-flex align-items-center justify-content-start">
          <LightTooltip
            title={
              <div className="movement-tooltip p-1">
                <div>
                  <p
                    className="tooltip-title"
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Reason
                  </p>
                  <p
                    className="tooltip-subTitle"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {data?.strReason}
                  </p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlinedIcon
              sx={{
                color: gray900,
                fontWeight: 400,
              }}
            />
          </LightTooltip>
          <div className="ml-2">{data?.numWithdrawAmount}</div>
        </div>
      ),
    },
    {
      title: () => <span style={{ color: gray600 }}>Waiting Stage</span>,
      dataIndex: "waitingStage",
    },
    {
      title: () => <span style={{ color: gray600 }}>Status</span>,
      render: (_, data) => (
        <>
          {data?.application?.strStatus === "Pending" && (
            <>
              <div className="actionChip">
                <Chips label="Pending" classess=" warning" />
              </div>
              <div className="d-flex actionIcon justify-content-center">
                <Tooltip title="Accept">
                  <div
                    className="mx-2 muiIconHover success "
                    onClick={(e) => {
                      demoPopup(
                        "approve",
                        "Approved",
                        data,
                        orgId,
                        employeeId,
                        isOfficeAdmin,
                        setApplicationListData,
                        setAllData,
                        setLoading
                      );
                      e.stopPropagation();
                    }}
                  >
                    <MuiIcon icon={<CheckCircle sx={{ color: "#34A853" }} />} />
                  </div>
                </Tooltip>
                <Tooltip title="Reject">
                  <div
                    className="muiIconHover danger"
                    onClick={(e) => {
                      demoPopup(
                        "reject",
                        "Reject",
                        data,
                        orgId,
                        employeeId,
                        isOfficeAdmin,
                        setApplicationListData,
                        setAllData,
                        setLoading
                      );
                      e.stopPropagation();
                    }}
                  >
                    <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                  </div>
                </Tooltip>
              </div>
            </>
          )}
          {data?.application?.strStatus === "Rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </>
      ),
    },
  ];
};

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));

const demoPopup = (
  action,
  text,
  data,
  orgId,
  employeeId,
  isOfficeAdmin,
  setApplicationListData,
  setAllData,
  setLoading
) => {
  let payload = [
    {
      applicationId: data?.application?.intPfwithdrawId,
      approverEmployeeId: employeeId,
      isReject: text === "Reject" ? true : false,
      accountId: orgId,
      isAdmin: isOfficeAdmin,
    },
  ];

  const callback = () => {
    getWithdrawalListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        approverId: employeeId,
        workplaceGroupId: 0,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },
      setApplicationListData,
      setAllData,
      setLoading
    );
  };
  let confirmObject = {
    closeOnClickOutside: false,
    message: ` Do you want to ${action}? `,
    yesAlertFunc: () => {
      withdrawalApproveReject(payload, callback);
    },
    noAlertFunc: () => {},
  };
  IConfirmModal(confirmObject);
};
