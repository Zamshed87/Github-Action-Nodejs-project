import {
  AddOutlined,
  InfoOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import PrimaryButton from "../../../../common/PrimaryButton";
import ViewModal from "../../../../common/ViewModal";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../../utility/customColor";
import { timeFormatter } from "../../../../utility/timeFormatter";
import { getPeopleDeskAllLandingForCalender } from "../../helper";
import NoResult from "./../../../../common/NoResult";
import ResetButton from "./../../../../common/ResetButton";
import Loading from "./../../../../common/loading/Loading";
import CalendarSetupModal from "./AddEditForm";
import ViewCalendarSetup from "./ViewDetails";
import "./calendarSetup.css";
import { LightTooltip } from "common/LightTooltip";
import MasterFilter from "common/MasterFilter";
import { DataTable } from "Components";
import { getSerial } from "Utils";

const initData = {
  search: "",
};

const validationSchema = Yup.object({});

export default function CalendarSetup() {
  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");

  // for create state Modal
  const [open, setOpen] = useState(false);

  // for view state Modal
  const [viewModal, setViewModal] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Calendar Setup";
  }, []);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
  });

  // for create Modal
  const handleOpen = () => {
    setViewModal(false);
    setOpen(true);
  };

  const handleClose = () => {
    setViewModal(false);
    setOpen(false);
    setId("");
    setSingleData("");
  };

  // for view Modal
  const handleViewOpen = () => {
    setViewModal(true);
    setOpen(false);
  };

  const handleViewClose = () => {
    setViewModal(false);
    setOpen(false);
    setId("");
  };

  const [loading, setLoading] = useState(false);

  // single Data
  const [id, setId] = useState("");

  const { orgId, buId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getLanding = () => {
    getPeopleDeskAllLandingForCalender(
      wId,
      buId,
      setRowDto,
      setAllData,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      ""
    );
  };

  useEffect(() => {
    getLanding();
  }, [wId, buId]);


  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 40) {
      permission = item;
    }
  });

  const columns = [
    {
      title: () => <span style={{ color: gray600 }}>SL</span>,
      render: (_, rec, index) =>
        getSerial({
          currentPage: rowDto?.currentPage,
          pageSize: rowDto?.pageSize,
          index,
        }),
      width: 15,
      className: "text-center",
    },
    {
      title: "Calender Name",
      dataIndex: "strCalenderName",
      width: 45,
      sorter: true,
      filter: true,
    },
    {
      title: "Min. Work Hour",
      dataIndex: "numMinWorkHour",
      render: (_, data) => <>{data?.numMinWorkHour || "-"}</>,
      width: 40,
      sorter: true,
      filter: true,
      className: "text-center",
    },
    {
      title: () => <span style={{ color: gray600 }}>Office Opening Time</span>,
      dataIndex: "dteOfficeStartTime",
      width: 40,
      render: (_, record) => (
        <span>
          {record?.dteOfficeStartTime
            ? timeFormatter(record?.dteOfficeStartTime)
            : "-"}
        </span>
      ),
    },
    {
      title: () => <span style={{ color: gray600 }}>Start Time</span>,
      width: 25,
      render: (_, record) => (
        <span>
          {record?.dteStartTime ? timeFormatter(record?.dteStartTime) : "-"}
        </span>
      ),
    },
    {
      title: () => <span style={{ color: gray600 }}>Extended Start Time</span>,
      dataIndex: "dteExtendedStartTime",
      width: 40,
      render: (_, record) => (
        <span>
          {record?.dteExtendedStartTime
            ? timeFormatter(record?.dteExtendedStartTime)
            : "-"}
        </span>
      ),
    },
    {
      title: () => <span style={{ color: gray600 }}>Last Start Time</span>,
      dataIndex: "dteLastStartTime",
      width: 35,
      render: (_, record) => (
        <span>
          {record?.dteLastStartTime
            ? timeFormatter(record?.dteLastStartTime)
            : "-"}
        </span>
      ),
    },
    {
      title: () => <span style={{ color: gray600 }}>End Time</span>,
      width: 25,
      render: (_, record) => (
        <span>
          {record?.dteEndTime ? timeFormatter(record?.dteEndTime) : "-"}
        </span>
      ),
    },
    {
      title: () => (
        <span style={{ color: gray600 }}>
          Lunch break is calculated as working hour
        </span>
      ),
      width: 80,
      render: (_, record) => (
        <span>
          {record?.isLunchBreakCalculateAsWorkingHour ? "Yes" : "No" || "N/A"}
        </span>
      ),
    },
    {
      title: () => <span style={{ color: gray600 }}>Office Closing Time</span>,
      dataIndex: "dteOfficeCloseTime",
      width: 40,
      render: (_, record) => (
        <>
          <span style={{ marginRight: "20px" }}>
            {record?.dteOfficeCloseTime
              ? timeFormatter(record?.dteOfficeCloseTime)
              : "-"}
          </span>
          <span>
            <LightTooltip
              title={
                <div className="holiday-exception-tooltip tableOne">
                  <table className="table table-borderless mb-0">
                    With each calendar setup modification, you must Re-assign
                    the calendar{" "}
                    <a
                      href="/administration/timeManagement/calendarAssign"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span style={{ fontSize: "13px", color: "blue" }}>
                        here
                      </span>
                    </a>
                    .
                  </table>
                </div>
              }
              arrow
            >
              <InfoOutlined style={{ color: "red" }} />
            </LightTooltip>
          </span>
        </>
      ),
    },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card calendarSetup-main">
                  <div className="table-card-heading">
                    <div className="total-result">
                      {rowDto?.data?.length > 0 ? (
                        <>
                          <h6
                            style={{
                              fontSize: "14px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            Total {rowDto?.totalCount} items
                          </h6>
                        </>
                      ) : (
                        <>
                          <small>Total result 0</small>
                        </>
                      )}
                    </div>
                    <ul className="d-flex flex-wrap">
                      {values?.search && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={<SettingsBackupRestoreOutlined />}
                            onClick={() => {
                              getLanding();
                              setRowDto(allData);
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          isHiddenFilter
                          width="200px"
                          inputWidth="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            if (value) {
                              getPeopleDeskAllLandingForCalender(
                                wId,
                                buId,
                                setRowDto,
                                setAllData,
                                setLoading,
                                pagination?.current,
                                pagination?.pageSize,
                                value || ""
                              );
                            } else {
                              getLanding();
                            }
                            // filterData(value, allData, setRowDto);
                            setFieldValue("search", value);
                          }}
                          cancelHandler={() => {
                            getLanding();
                            setFieldValue("search", "");
                          }}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          label={"calendar Setup"}
                          className="btn btn-default flex-center"
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            e.stopPropagation();
                            handleOpen();
                            setId("");
                          }}
                        />
                      </li>
                    </ul>
                  </div>

                  {rowDto?.data?.length > 0 ? (
                    <DataTable
                      bordered
                      data={rowDto?.data || []}
                      loading={loading}
                      header={columns}
                      pagination={{
                        pageSize: rowDto?.pageSize,
                        total: rowDto?.totalCount,
                      }}
                      onChange={(pagination, filters, sorter, extra) => {
                        if(extra?.action == "paginate"){
                          getPeopleDeskAllLandingForCalender(
                            wId,
                            buId,
                            setRowDto,
                            setAllData,
                            setLoading,
                            pagination?.current,
                            pagination?.pageSize,
                            values?.search || ""
                          );
                        }
                      }}
                      onRow={(dataRow) => ({
                        onClick: () => {
                          if (!permission?.isEdit)
                            return toast.warn("You don't have permission");
                          setId(dataRow?.calenderId);
                          setViewModal(true);
                        },
                      })}
                      // scroll={{ x: 2000 }}
                    />
                  ) : (
                    <>
                      {!loading && <NoResult title="No Result Found" para="" />}
                    </>
                  )}
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>

      <ViewModal
        size="lg"
        title={id ? "Edit Calendar Setup" : "Create Calendar Setup"}
        backdrop="static"
        classes="default-modal preview-modal"
        show={open}
        orgId={orgId}
        onHide={handleClose}
        handleOpen={handleOpen}
      >
        <CalendarSetupModal
          id={id}
          handleOpen={handleOpen}
          setOpen={setOpen}
          onHide={handleClose}
          singleData={singleData}
          setSingleData={setSingleData}
          setRowDto={setRowDto}
          setAllData={setAllData}
          getLanding={getLanding}
        />
      </ViewModal>

      <ViewModal
        size="lg"
        title="View Calendar Setup"
        backdrop="static"
        classes="default-modal preview-modal"
        show={viewModal}
        orgId={orgId}
        onHide={handleViewClose}
        handleOpen={handleViewOpen}
      >
        <ViewCalendarSetup
          id={id}
          handleOpen={handleOpen}
          handleViewOpen={handleViewOpen}
          setViewModal={setViewModal}
          onHide={handleViewClose}
          singleData={singleData}
          setSingleData={setSingleData}
          setLoading={setLoading}
          setAllData={setAllData}
          setId={setId}
        />
      </ViewModal>
    </>
  );
}
