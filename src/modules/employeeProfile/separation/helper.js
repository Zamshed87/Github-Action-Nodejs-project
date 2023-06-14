import {
  EditOutlined,
  FilePresentOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { gray500, gray700, gray900 } from "../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput,
  getDateOfYear,
} from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";
import { LightTooltip } from "../LoanApplication/helper";

export const getRoleAssigneToUser = async (buId, wgId, id, setter) => {
  try {
    const res = await axios.post(
      `/Auth/RoleAssignToUserById?businessUnitId=${buId}&workplaceGroupId=${wgId}&employeeId=${id}`
    );
    if (res?.data) {
      setter && setter(res?.data);
    }
  } catch (error) {}
};

// self separation create
export const separationCrud = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post("/Employee/CRUDEmployeeSeparation", payload);
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
  search,
  setter,
  setLoading,
  pageNo,
  pageSize,
  setPages
) => {
  try {
    setLoading && setLoading(true);

    let apiUrl = `/Employee/EmployeeSeparationListFilter?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&FromDate=${fromDate}&ToDate=${toDate}&IsForXl=false&PageNo=${pageNo}&PageSize=${pageSize}`;

    search && (apiUrl += `&searchTxt=${search}`);

    const res = await axios.get(apiUrl);

    if (res?.data) {
      if (partType === "EmployeeSeparationList") {
        const modifiedData = res?.data?.data?.map((item, index) => ({
          ...item,
          initialSerialNumber: index + 1,
          docArr: item?.strDocumentId?.split(","),
        }));
        setter?.(modifiedData);

        setPages({
          current: res?.data?.currentPage,
          pageSize: res?.data?.pageSize,
          total: res?.data?.totalCount,
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
  permission
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
      title: "Status",
      dataIndex: "approvalStatus",
      sort: true,
      filter: false,
      render: (item) => (
        <>
          {item?.approvalStatus === "Approve" && (
            <Chips label="Approved" classess="success p-2" />
          )}
          {item?.approvalStatus === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
          {item?.approvalStatus === "Process" && (
            <Chips label="Process" classess="primary p-2" />
          )}
          {item?.approvalStatus === "Reject" && (
            <>
              <Chips label="Rejected" classess="danger p-2 mr-2" />
            </>
          )}
          {item?.approvalStatus === "Released" && (
            <>
              <Chips label="Released" classess=" p-2 mr-2" />
            </>
          )}
        </>
      ),
      fieldType: "string",
    },
    {
      title: "",
      dataIndex: "approvalStatus",
      render: (item) => (
        <div className="d-flex">
          {item?.approvalStatus === "Pending" && (
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    history.push(
                      `/profile/separation/edit/${item?.separationId}`
                    );
                  }}
                />
              </button>
            </Tooltip>
          )}
          {item?.approvalStatus === "Approve" && (
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              className="btn btn-default btn-assign"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  dateFormatterForInput(item?.dteLastWorkingDate) +
                    "T00:00:00" >
                  todayDate() + "T00:00:00"
                ) {
                  return toast.warn(
                    `Can not release due to the employee having some working days left`
                  );
                }
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                history.push(
                  `/profile/separation/release/${item?.separationId}`
                );
              }}
            >
              Release
            </button>
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
export const getSeparationLandingById = async (payload, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      "/Employee/EmployeeSeparationListFilter",
      payload
    );
    setLoading && setLoading(false);
    const modifyRes = res?.data?.map((itm) => {
      return {
        ...itm,
        docArr:
          itm?.strDocumentId?.length > 0 ? itm?.strDocumentId?.split(",") : [],
        halfReason:
          itm?.Reason?.length > 120
            ? itm?.Reason.slice(0, 120)
            : `${itm?.Reason.slice(0, 120)}...`,
        fullReason: itm?.Reason,
      };
    });
    setter(modifyRes[0]);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// self separation delete
export const deleteSeparationAttachment = async (id, documentationId, cb) => {
  try {
    const res = await axios.post(
      `/Employee/EmployeeSeparationDocumentDelete?intSeparationid=${id}&DocumentId=${documentationId}`
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

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const getEmployeeSeparationLanding = async (obj) => {
  const {
    status,
    depId,
    desId,
    supId,
    emTypId,
    empId,
    workId,
    buId,
    orgId,
    setter,
    setLoading,
    separationTypeId,
    setAllData,
    tableName,
    setTableRowDto,
    fromDate,
    toDate,
    searchTxt,
    pages,
    setPages,
  } = obj;
  try {
    setLoading(true);
    const payload = {
      status: status || "",
      departmentId: depId || 0,
      designationId: desId || 0,
      supervisorId: supId || 0,
      employmentTypeId: emTypId || 0,
      employeeId: empId || 0,
      workplaceGroupId: workId || 0,
      applicationFromDate: fromDate || getDateOfYear("first"),
      applicationToDate: toDate || getDateOfYear("last"),
      businessUnitId: buId || 0,
      accountId: orgId || 0,
      separationTypeId: separationTypeId || 0,
      tableName: tableName,
      searchTxt,
      pageNo: pages?.current,
      pageSize: pages?.pageSize,
    };
    const res = await axios.post(
      "/Employee/EmployeeSeparationListFilter",
      payload
    );
    setLoading(false);
    setter(res?.data);
    setPages({
      current: pages?.current,
      pageSize: pages?.pageSize,
      total: res?.data[0]?.totalCount,
    });
    setTableRowDto((prev) => ({
      ...prev,
      data: res?.data,
      totalCount: res?.data?.length,
    }));
    setAllData(res?.data);
  } catch (error) {
    setLoading(false);
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
      "/Employee/ReleasedEmployeeSeparation",
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
