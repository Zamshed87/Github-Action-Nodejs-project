import { CloseCircleTwoTone, SettingTwoTone } from "@ant-design/icons";
import { FilePresentOutlined, InfoOutlined } from "@mui/icons-material";
import { Dropdown, Tooltip } from "antd";
import axios from "axios";
import Chips from "common/Chips";
import IConfirmModal from "common/IConfirmModal";
import { LightTooltip } from "common/LightTooltip";
import PrimaryButton from "common/PrimaryButton";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import moment from "moment";
import { toast } from "react-toastify";
import { gray500, gray700, gray900 } from "utility/customColor";
import { dateFormatter } from "utility/dateFormatter";

// separation create
export const CreateSeparation = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post("/separation/CreateSeparation", payload);
    cb && cb();
    setLoading && setLoading(false);
    toast.success(res?.data?.message || "Submitted Successfully", {
      toastId: 1,
    });
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
// separation update
export const UpdateSeparation = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post("/separation/UpdateSeparation", payload);
    cb && cb();
    setLoading && setLoading(false);
    toast.success(res?.data?.message || "Submitted Successfully", {
      toastId: 1,
    });
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

// self separation landing
export const getSeparationLanding = async (
  partType = "",
  buId,
  wgId,
  fromDate,
  toDate,
  status,
  search,
  setter,
  setLoading,
  pageNo,
  pageSize,
  setPages,
  wId,
  empId,
  workplaceGroupList,
  workplaceList
) => {
  try {
    setLoading && setLoading(true);
    let apiUrl = `/separation/GetSeparations?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&FromDate=${fromDate}&ToDate=${toDate}&status=${status}&IsForXl=false&PageNo=${pageNo}&PageSize=${pageSize}&WorkplaceGroupList=${workplaceGroupList}&WorkplaceList=${workplaceList}`;

    search && (apiUrl += `&searchTxt=${search}`);
    empId && (apiUrl += `&EmployeeId=${empId}`);

    const res = await axios.get(apiUrl);

    if (res?.data) {
      if (partType === "EmployeeSeparationList") {
        const modifiedData = res?.data?.list?.map((item, index) => ({
          ...item,
          initialSerialNumber: index + 1,
          docArr: item?.strDocumentId?.split(","),
        }));
        setter?.(modifiedData);

        setPages({
          current: res?.data?.pageparam?.pageNo,
          pageSize: res?.data?.pageparam?.pageSize,
          total: res?.data?.pageparam?.totalCount,
        });
      }
    }

    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const separationApplicationLandingTableColumn = (
  page,
  paginationSize,
  history,
  dispatch,
  employeeId,
  getData,
  setChargeHandOverModal,
  postWithdrawSeperationData,
  postCancelSeperationData,
  aprovalStatus,
  setAprovalStatus,
  separationId
) => {
  const confirmPopup = () => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: "Are you sure you want to withdraw this application?",
      yesAlertFunc: () => {
        postWithdrawSeperationData(
          `/Separation/WithdrawalSeparation?id=${separationId}&employeeId=${employeeId}`,
          "",
          () => {
            getData();
          },
          true
        );
      },
      noAlertFunc: () => {
        history.push("/SelfService/separation/applicationV2");
      },
    };
    IConfirmModal(confirmObject);
  };

  const cancelConfirmPopup = () => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: "Do you want to Cancel this application?",
      yesAlertFunc: () => {
        postCancelSeperationData(
          `/Separation/CancelSeparation?id=${separationId}&employeeId=${employeeId}`,
          "",
          () => {
            getData();
          }
        );
      },
      noAlertFunc: () => {
        history.push("/SelfService/separation/applicationV2");
      },
    };
    IConfirmModal(confirmObject);
  };

  const getMenuItems = (data) => [
    {
      key: "1",
      label: (
        <PrimaryButton
          type="button"
          className="btn btn-default"
          customStyle={{
            backgroundColor: "#1677ff",
            borderColor: "#1677ff",
            fontSize: "11px",
            width: "160px",
            height: "35px",
          }}
          label={"Charge Handover"}
          onClick={() => {
            setChargeHandOverModal(true);
          }}
        />
      ),
    },
    {
      key: "2",
      label: (
        <PrimaryButton
          type="button"
          className="btn btn-default"
          customStyle={{
            backgroundColor: "#13c2c2",
            borderColor: "#13c2c2",
            fontSize: "12px",
            width: "160px",
            height: "35px",
          }}
          label={"Exit Interview"}
          disabled={data?.intQuestionAssignId === null ? true : false || data?.isExitInterviewDone === true ? true : false}
          onClick={() => {
            history.push("/SelfService/separation/applicationV2/interView", {
              data: data,
            });
          }}
        />
      ),
    },
    {
      key: "3",
      label: (
        <PrimaryButton
          type="button"
          className="btn btn-default"
          customStyle={{
            backgroundColor: "#ff4d4f",
            borderColor: "#ff4d4f",
            fontSize: "12px",
            width: "160px",
            height: "35px",
          }}
          label={"Withdraw"}
          onClick={() => {
            confirmPopup();
          }}
        />
      ),
    },
  ];

  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "strEmployeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Separation Type",
      dataIndex: "strSeparationTypeName",
      render: (item) => (
        <div className="content tableBody-title d-flex align-items-center">
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
                      __html: item?.strReason,
                    }}
                  />
                  {item?.docArr?.length && item?.docArr?.[0] !== ""
                    ? item?.docArr.map((image, i) => (
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
          <span className="ml-2" style={{ fontSize: "11px" }}>
            {item?.strSeparationTypeName}
          </span>
        </div>
      ),
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Application Date",
      dataIndex: "dteSeparationDate",
      render: (data) => (
        <>
          {data?.dteSeparationDate
            ? dateFormatter(data?.dteSeparationDate)
            : "N/A"}
        </>
      ),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Last Working Date",
      dataIndex: "dteLastWorkingDate",
      render: (data) => (
        <>
          {data?.dteLastWorkingDate
            ? dateFormatter(data?.dteLastWorkingDate)
            : "N/A"}
        </>
      ),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Created By",
      dataIndex: "strCreatedBy",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Created Date",
      dataIndex: "dteCreatedAt",
      render: (data) => (
        <>{data?.dteCreatedAt ? dateFormatter(data?.dteCreatedAt) : "N/A"}</>
      ),
      sort: true,
      filter: false,
      fieldType: "date",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "approvalStatus",
      sort: true,
      filter: false,
      render: (item) => (
        <div className="d-flex justify-content-center align-items-center">
          <div>
            <div className="content tableBody-title d-flex align-items-center">
              <LightTooltip
                title={
                  <div className="p-1">
                    <div className="mb-1">
                      <table style={{ border: `1px solid #475467`, borderCollapse: "collapse" }}>
                        <th style={{ border: `1px solid #475467`, margin: "10px", padding: "10px" }}><p><b>Charge Handover</b></p></th>
                        <th style={{ border: `1px solid #475467`, margin: "10px", padding: "10px" }}><p><b>Exit Interview</b></p></th>
                        <tr>
                          <td style={{ border: `1px solid #475467`, textAlign: "center", padding: "5px 0" }}>{item?.isHandedOverDone === true ? <Chips label="Done" classess="success p-2" /> : <Chips label="Not Done" classess="warning p-2" />}</td>
                          <td style={{ border: `1px solid #475467`, textAlign: "center", padding: "5px 0" }}>{item?.isExitInterviewDone === true ? <Chips label="Done" classess="success p-2" /> : <Chips label="Not Done" classess="warning p-2" />}</td>
                        </tr>
                      </table>
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
            </div>
          </div>
          <div className="ml-2">
            {item?.approvalStatus?.includes("Approved") && (
              <Chips
                label="Approved"
                classess="success p-2"
              />
            )}
            {item?.approvalStatus === "Released" && (
              <Chips
                label="Released"
                classess="indigo p-2 mr-2"
              />
            )}
            {item?.approvalStatus === "Clearance" && (
              <Chips
                label="Clearance"
                classess="info p-2 mr-2"
              />
            )}
            {item?.approvalStatus === "Withdrawn" && (
              <Chips
                label="Withdrawn"
                classess="danger p-2 mr-2"
              />
            )}
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "",
      dataIndex: "approvalStatus",
      render: (item, data) => (
        <div className="d-flex">
          <Tooltip placement="top" color={"#34a853"} title={"Manage"}>
            <Dropdown
              menu={{
                items: getMenuItems(item),
              }}
              placement="bottomLeft"
              arrow={{
                pointAtCenter: true,
              }}
              trigger={["click"]}
              disabled={item?.approvalStatus !== "Approved"}
            >
              <PrimaryButton
                type="button"
                icon={<SettingTwoTone twoToneColor="#34a853" />}
                customStyle={{
                  height: "30px",
                  fontSize: "16px",
                  padding: "0px 12px 0px 12px",
                  border: "none",
                }}
                onClick={() => {
                  setAprovalStatus(item?.approvalStatus);
                }}
              />
            </Dropdown>
          </Tooltip>
          {item?.approvalStatus === "Pending" && (
            <Tooltip placement="top" color={"#ff4d4f"} title={"Cancel"}>
              <PrimaryButton
                type="button"
                icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                customStyle={{
                  height: "30px",
                  fontSize: "16px",
                  padding: "0px 12px 0px 12px",
                  border: "none",
                }}
                onClick={() => {
                  setAprovalStatus(item?.approvalStatus);
                  cancelConfirmPopup();
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
      sort: false,
      filter: false,
      fieldType: "string",
    },
  ];
};

// self separation get by id
export const getSeparationLandingById = async (id, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/separation/GetSeparationById/${id}`);

    const modifyRes = [res?.data]?.map((itm) => {
      return {
        ...itm,
        docArr:
          itm?.strDocumentId?.length > 0 ? itm?.strDocumentId?.split(",") : [],
        halfReason:
          itm?.strReason?.length > 120
            ? itm?.strReason?.slice(0, 120)
            : `${itm?.strReason?.slice(0, 120)}...`,
        fullReason: itm?.strReason,
      };
    });
    setter(modifyRes[0]);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// self separation delete
export const deleteSeparationAttachment = async (id, documentationId, cb) => {
  try {
    const res = await axios.post(
      `/separation/DocumentDelete?id=${id}&documentId=${documentationId}`
    );
    if (res.status === 200 && res?.data) {
      toast.success(res?.data?.message || "Delete Successfully", {
        toastId: 1,
      });
      cb && cb();
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const getEmployeeProfileViewData = async (
  id,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${id}&businessUnitId=${buId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const interViewQuestionSave = async (
  data,
  fieldsArr,
  values,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const payload = {
      EmployeeId: data?.intEmployeeId || 0,
      SeparationId: data?.separationId || 0,
      Request: {
        id: data?.intQuestionAssignId || 0,
        startDateTime: values?.startTime,
        endDateTime: moment().format("YYYY-MM-DDTHH:mm:ss"),
        questions: fieldsArr.map((field) => {
          const id = `field-${field.id}`;
          const answer = values[id];

          return {
            id: field.id,
            answer: field.typeName === "Checkbox" ? answer : [answer] || [],
          };
        }),
      },
    };


    const res = await axios.post(`/ExitInterview/SubmitExitInterview`, payload);
    cb && cb();
    toast.success(res?.data?.Message, { toastId: 1 });
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong", {
      toastId: 1,
    });
  } finally {
    setLoading(false);
  }
};
