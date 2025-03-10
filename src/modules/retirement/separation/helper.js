import {
  EditOutlined,
  FilePresentOutlined,
  InfoOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Tooltip, styled, tooltipClasses } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { gray500, gray700, gray900 } from "../../../utility/customColor";
import {
  dateFormatter
} from "../../../utility/dateFormatter";

export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));

export const getRoleAssigneToUser = async (buId, wgId, id, setter) => {
  try {
    const res = await axios.post(
      `/Auth/RoleAssignToUserById?businessUnitId=${buId}&workplaceGroupId=${wgId}&employeeId=${id}`
    );
    if (res?.data) {
      setter && setter(res?.data);
    }
  } catch (error) { }
};

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
  setOpenModal,
  permission,
  setId,
  setEmpId
) => {
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
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
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
      filter: false,
      fieldType: "date",
    },
    {
      title: "Created By",
      dataIndex: "strCreatedBy",
      filter: false,
      fieldType: "string",
    },
    {
      title: "Created Date",
      dataIndex: "dteCreatedAt",
      render: (data) => (
        <>
          {data?.dteCreatedAt
            ? dateFormatter(data?.dteCreatedAt)
            : "N/A"}
        </>
      ),
      filter: false,
      fieldType: "date",
    },
    {
      title: "Status",
      dataIndex: "approvalStatus",
      filter: false,
      render: (data) => (
        <div className="d-flex align-items-center">
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
                          <td style={{ border: `1px solid #475467`, textAlign: "center", padding: "5px 0" }}>{data?.isHandedOverDone === true ? <Chips label="Done" classess="success p-2" /> : <Chips label="Not Done" classess="warning p-2" />}</td>
                          <td style={{ border: `1px solid #475467`, textAlign: "center", padding: "5px 0" }}>{data?.isExitInterviewDone === true ? <Chips label="Done" classess="success p-2" /> : <Chips label="Not Done" classess="warning p-2" />}</td>
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
            {data?.approvalStatus === "Pending" && (
              <Chips label="Pending" classess="warning p-2" />
            )}
            {data?.approvalStatus === "Cancelled" && (
              <Chips label="Cancelled" classess="danger p-2" />
            )}
            {data?.approvalStatus === "Approved" && (
              <Chips label="Approved" classess="success p-2" />
            )}
            {data?.approvalStatus === "Withdrawn" && (
              <Chips label="Withdrawn" classess="danger p-2" />
            )}
            {data?.approvalStatus === "Clearance" && (
              <Chips label="Clearance" classess="info p-2" />
            )}
            {data?.approvalStatus === "Final Settlement Completed" && (
              <Chips label="Final Settlement Completed" classess="success p-2" />
            )}
            {data?.approvalStatus === "Released" && (
              <Chips label="Released" classess="indigo p-2" />
            )}
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Actions",
      dataIndex: "approvalStatus",
      render: (item) => (
        <div className="d-flex">
          <Tooltip title="View" arrow>
            <button className="iconButton" type="button" style={{
              height: "25px",
              width: "25px"
            }}>
              <VisibilityOutlined
                sx={{ color: "#34a853" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setId(item?.separationId);
                  setEmpId(item?.intEmployeeId);
                  setOpenModal(true);
                }}
              />
            </button>
          </Tooltip>
          {item?.approvalStatus === "Pending" && (
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button" style={{
                height: "25px",
                width: "25px"
              }}>
                <EditOutlined
                  sx={{ color: "#34a853" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    history.push(
                      `/retirement/separation/edit/${item?.separationId}`
                    );
                  }}
                />
              </button>
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
    const res = await axios.get(
      `/separation/GetSeparationById/${id}`
    );

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

export const employeeSeparationCrud = async (
  partId,
  employeeId,
  values,
  setLoading,
  getData,
  orgId,
  buId,
  wgId
) => {
  try {
    setLoading(true);
    let payload = {
      partId: partId,
      intSeparationId: values?.autoId || 0,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      intEmployeeId: values?.employee?.value || 0,
      strEmployeeName: values?.employee?.label || "",
      strEmployeeCode: values?.employee?.strEmployeeCode || "",
      intSeparationTypeId: values?.separationType?.value || "",
      strSeparationTypeName: values?.separationType?.label || "",
      dteLastWorkingDay: values?.lastWorkingDay || "",
      strReason: values?.reason || "",
      numAdjustedAmound: values?.adjustedAmount || 0,
      isActive: true,
      intAccountId: orgId,
      intCreatedBy: employeeId,
    };
    const res = await axios.post("/Employee/CRUDEmployeeSeparation", payload);
    getData();
    setLoading(false);
    toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const getEmployeeSeparationLanding = async (
  wId,
  buId,
  wgId,
  formData,
  toData,
  search,
  isForXl = false,
  setter,
  setLoading,
  pageNo,
  pageSize,
  setPages,
  workplaceGroupList,
  workplaceList
) => {
  setLoading && setLoading(true);

  try {
    let apiUrl = `/Employee/EmployeeSeparationListFilter?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&FromDate=${formData}&ToDate=${toData}&IsForXl=${isForXl}&PageNo=${pageNo}&PageSize=${pageSize}&WorkplaceGroupList=${workplaceGroupList}&WorkplaceList=${workplaceList}`;

    search = search && (apiUrl += `&searchTxt=${search}`);

    const res = await axios.get(apiUrl);

    if (res?.data) {
      const modifiedData = res?.data?.data?.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));

      setter && setter?.(modifiedData);

      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const searchData = (keywords, allData, setRowDto, setLoading) => {
  try {
    if (!keywords) {
      setRowDto(allData);
      return;
    }
    setLoading && setLoading(true);
    const regex = new RegExp(keywords?.toLowerCase());
    let newData = allData?.filter(
      (item) =>
        regex.test(item?.EmployeeName?.toLowerCase()) ||
        regex.test(item?.DepartmentName?.toLowerCase()) ||
        regex.test(item?.DesignationName?.toLowerCase()) ||
        regex.test(item?.SeparationTypeName?.toLowerCase())
    );
    setRowDto(newData);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setRowDto([]);
  }
};

export const releasedEmployeeSeparation = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      "/separation/ReleasedSeparation",
      payload
    );
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
