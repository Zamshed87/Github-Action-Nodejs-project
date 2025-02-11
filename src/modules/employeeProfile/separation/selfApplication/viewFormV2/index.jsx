import {
  AddOutlined,
  EditOutlined,
  FilePresentOutlined,
  InfoOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Form } from "antd";
import Chips from "common/Chips";
import { LightTooltip } from "common/LightTooltip";
import Loading from "common/loading/Loading";
import NoResultTwo from "common/NoResultTwo";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "common/peopleDeskTable";
import PrimaryButton from "common/PrimaryButton";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { PModal } from "Components/Modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { gray500, gray700, gray900 } from "utility/customColor";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { dateFormatter, dateFormatterForInput } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";

const paginationSize = 100;
export const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};
export default function SelfServiceSeparation() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const {
    profileData: { buId, wgId, wId, employeeId },
  } = useSelector((state) => state?.auth, shallowEqual);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const [SeperationData, getSeperationData] = useAxiosGet();
  const [, postCancelSeperationData] = useAxiosPost();

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30535) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [empId, setEmpId] = useState(null);

  // landing
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const getData = () => {
    getSeperationData(`/Separation/GetSeparationByEmployee`, () => {
      setRowDto(SeperationData);
      setLoading(false);
    });
  };

  const handleChangePage = (_, newPage, searchText = "") => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText = "") => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  useEffect(() => {
    getData();
  }, [buId, wgId, wId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card businessUnit-wrapper dashboard-scroll">
          <div
            className="table-card-heading d-flex justify-content-end"
            style={{ marginBottom: "20px" }}
          >
            <PrimaryButton
              type="button"
              className="btn btn-default"
              label={"Apply"}
              icon={<AddOutlined sx={{ marginRight: "11px" }} />}
              onClick={(e) => {
                e.stopPropagation();
                history.push("/SelfService/separation/applicationV2/create");
              }}
            />
          </div>
          <div
            className="table-card-heading d-flex justify-content-end"
            style={{ marginBottom: "20px" }}
          >
            <PrimaryButton
              type="button"
              className="btn btn-default"
              label={"Cancel"}
              icon={<AddOutlined sx={{ marginRight: "11px" }} />}
              onClick={(e) => {
                postCancelSeperationData(
                  `/Separation/CancelSeparation?id=${231}&employeeId=${employeeId}`
                );
              }}
            />
          </div>
          {rowDto?.length > 0 ? (
            <>
              <PeopleDeskTable
                customClass="iouManagementTable"
                columnData={separationApplicationLandingTableColumn(
                  pages?.current,
                  pages?.pageSize,
                  history,
                  dispatch,
                  setOpenModal,
                  permission,
                  setId,
                  setEmpId
                )}
                pages={pages}
                rowDto={rowDto}
                setRowDto={setRowDto}
                handleChangePage={(e, newPage) =>
                  handleChangePage(e, newPage, values?.search)
                }
                handleChangeRowsPerPage={(e) =>
                  handleChangeRowsPerPage(e, values?.search)
                }
                uniqueKey="strEmployeeCode"
                isCheckBox={false}
                isScrollAble={false}
              />
              <PModal
                title="Separation History View"
                open={openModal}
                onCancel={() => {
                  setOpenModal(false);
                }}
                width={1000}
              />
            </>
          ) : (
            <>
              {!loading && (
                <NoResultTwo
                  title="You have no application. "
                  to="/SelfService/separation/applicationV2/create"
                />
              )}
            </>
          )}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}

const separationApplicationLandingTableColumn = (
  page,
  paginationSize,
  history,
  dispatch,
  setOpenModal,
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
            <Chips label="Rejected" classess="danger p-2 mr-2" />
          )}
          {item?.approvalStatus === "Released" && (
            <Chips label="Released" classess="indigo p-2 mr-2" />
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
          <Tooltip title="View" arrow>
            <button className="iconButton" type="button">
              <VisibilityOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModal(true);
                }}
              />
            </button>
          </Tooltip>
          {item?.approvalStatus === "Pending" && (
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
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
                  `/retirement/separation/release/${item?.separationId}`
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
