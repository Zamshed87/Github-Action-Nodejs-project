import {
  Cancel,
  CheckCircle,
  FilePresentOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../../common/AntTable";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import MuiIcon from "../../../../../common/MuiIcon";
import NoResult from "../../../../../common/NoResult";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import {
  gray500,
  gray700,
  gray900,
  greenColor,
} from "../../../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../../../utility/dateFormatter";
import {
  getAllSeparationListDataForApproval,
  separationApproveReject,
} from "../helper";
import { PModal } from "Components/Modal";
import ManagementSeparationHistoryView from "../../mgmApplication/viewForm/ManagementSeparationHistoryView";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

const CardTable = ({ propsObj }) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    applicationListData,
    setApplicationListData,
    // appliedStatus,
    allData,
    setAllData,
    setSingleData,
    setViewModal,
    // filterValues,
    // setFilterValues,
    setLoading,
    loading,
  } = propsObj;

  const { employeeId, isOfficeAdmin, orgId, strDisplayName, wId, buId, wgId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(null);
  const [buttonType, setButtonType] = useState(null);
  const [comment, setComment] = useState("");

  const demoPopup = (action, text, data) => {
    const payload = [
      {
        applicationId: data?.application?.intSeparationId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
        approverEmployeeName: strDisplayName,
        comments: comment,
      },
    ];

    const callback = () => {
      getAllSeparationListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceId: wId,
          businessUnitId: buId,
          workplaceGroupId: wgId,
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
      setOpenModal(false);
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        separationApproveReject(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
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

  const columns = (page, paginationSize) => [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    // {
    //   title: () => (
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //       }}
    //     >
    //       <FormikCheckBox
    //         styleObj={{
    //           margin: "0 auto!important",
    //           padding: "0 !important",
    //           color: gray900,
    //           checkedColor: greenColor,
    //         }}
    //         name="allSelected"
    //         checked={
    //           applicationListData?.listData?.length > 0 &&
    //           applicationListData?.listData?.every(
    //             (item) => item?.selectCheckbox
    //           )
    //         }
    //         onChange={(e) => {
    //           setApplicationListData({
    //             listData: applicationListData?.listData?.map((item) => ({
    //               ...item,
    //               selectCheckbox: e.target.checked,
    //             })),
    //           });
    //           setAllData({
    //             listData: allData?.listData?.map((item) => ({
    //               ...item,
    //               selectCheckbox: e.target.checked,
    //             })),
    //           });
    //           setFieldValue("allSelected", e.target.checked);
    //         }}
    //       />

    //       <span style={{ marginLeft: "5px" }}>Employee Id</span>
    //     </div>
    //   ),
    //   dataIndex: "employeeCode",
    //   render: (_, record, index) => (
    //     <div onClick={(e) => e.stopPropagation()}>
    //       <FormikCheckBox
    //         styleObj={{
    //           margin: "0 auto!important",
    //           color: gray900,
    //           checkedColor: greenColor,
    //           padding: "0px",
    //         }}
    //         name="selectCheckbox"
    //         color={greenColor}
    //         checked={record?.selectCheckbox}
    //         onChange={(e) => {
    //           // let data = [...applicationListData?.listData];
    //           // data[i].selectCheckbox = e.target.checked;
    //           let data = applicationListData?.listData?.map((item) => {
    //             if (item.intId === record?.intId) {
    //               return {
    //                 ...item,
    //                 selectCheckbox: e.target.checked,
    //               };
    //             } else return item;
    //           });
    //           let data2 = allData?.listData?.map((item) => {
    //             if (item.intId === record?.intId) {
    //               return {
    //                 ...item,
    //                 selectCheckbox: e.target.checked,
    //               };
    //             } else return item;
    //           });
    //           setApplicationListData({ listData: [...data] });
    //           setAllData({ listData: [...data2] });
    //         }}
    //         disabled={record?.ApplicationStatus === "Approved"}
    //       />

    //       <span style={{ marginLeft: "5px" }}>{record?.employeeCode}</span>
    //     </div>
    //   ),
    // },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (EmployeeName) => (
        <div className="d-flex align-items-center">
          <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
          <span className="ml-2">{EmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
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
      title: "Employee Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
    },
    {
      title: "Separation Type",
      dataIndex: "strSeparationTypeName",
      render: (_, record) => (
        <>
          <LightTooltip
            title={
              <div className="p-1">
                <div className="mb-1">
                  <h3
                    className="tooltip-title"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: gray700,
                      marginBottom: "12px",
                    }}
                  >
                    Application
                  </h3>
                  <div
                    className=""
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: gray500,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: record?.strReason,
                    }}
                  />
                  {record?.application?.strDocumentId?.length > 0
                    ? record?.application?.strDocumentId
                        .split(",")
                        .map((image, i) => (
                          <p
                            style={{
                              margin: "6px 0 0",
                              fontWeight: "400",
                              fontSize: "12px",
                              lineHeight: "18px",
                              color: "#009cde",
                              cursor: "pointer",
                            }}
                            key={i}
                          >
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(getDownlloadFileView_Action(image));
                              }}
                            >
                              <>
                                <FilePresentOutlined /> {`Attachment_${i + 1}`}
                              </>
                            </span>
                          </p>
                        ))
                    : ""}
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlined
              sx={{
                color: gray900,
              }}
            />
          </LightTooltip>
          <span className="ml-2"></span>
          {record?.strSeparationTypeName}
        </>
      ),
    },
    {
      title: "Application Date",
      dataIndex: "dteSeparationDate",
      render: (_, record) =>
        dateFormatter(record?.application?.dteSeparationDate),
    },
    {
      title: "Last Working Date",
      dataIndex: "dteLastWorkingDate",
      render: (_, record) => dateFormatter(record?.dteLastWorkingDate),
    },
    {
      title: "Waiting Stage",
      dataIndex: "waitingStage",
      render: (_, record) => <>{record?.waitingStage}</>,
      hidden: isOfficeAdmin,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <div>
          {record?.status === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.status === "Pending" && (
            <>
              <div className="actionChip">
                <Chips label="Pending" classess=" warning" />
              </div>
              <div className="d-flex actionIcon justify-content-center">
                <Tooltip title="Approve">
                  <div
                    className="mx-2 muiIconHover success "
                    onClick={(e) => {
                      e.stopPropagation();
                      // demoPopup("approve", "Approve", record);
                      if (
                        dateFormatterForInput(record?.dteLastWorkingDate) +
                          "T00:00:00" >
                        todayDate() + "T00:00:00"
                      ) {
                        return toast.warn(
                          `Can not approve due to the employee having some working days left`
                        );
                      }
                      setData(record);
                      setButtonType("approve");
                      setOpenModal(true);
                    }}
                  >
                    <MuiIcon icon={<CheckCircle sx={{ color: "#34A853" }} />} />
                  </div>
                </Tooltip>
                <Tooltip title="Reject">
                  <div
                    className="muiIconHover danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      // demoPopup("reject", "Reject", record);
                      setData(record);
                      setButtonType("reject");
                      setOpenModal(true);
                    }}
                  >
                    <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                  </div>
                </Tooltip>
              </div>
            </>
          )}
          {record?.status === "Rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {allData?.listData?.length > 0 ? (
        <AntTable
          // rowSelection={{
          //   type: "checkbox",
          // }}
          data={allData?.listData}
          columnsData={columns(page, paginationSize)}
          onRowClick={(dataRow) => {
            setSingleData(dataRow);
            setViewModal(true);
          }}
          setColumnsData={(dataRow) => {
            if (dataRow?.length === allData?.listData?.length) {
              const temp = dataRow?.map((item) => {
                return {
                  ...item,
                  selectCheckbox: false,
                };
              });
              setApplicationListData({ listData: [...temp] });
              setAllData({ listData: [...temp] });
            } else {
              setApplicationListData({ listData: [...dataRow] });
            }
          }}
          setPage={setPage}
          setPaginationSize={setPaginationSize}
        />
      ) : (
        <NoResult />
      )}
      <PModal
        title="Separation History View"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        components={
          <ManagementSeparationHistoryView
            id={data?.application?.intSeparationId}
            type="approval"
            demoPopup={demoPopup}
            data={data}
            buttonType={buttonType}
            setComment={setComment}
            loading={loading}
          />
        }
        width={1000}
      />
    </>
  );
};

export default CardTable;
