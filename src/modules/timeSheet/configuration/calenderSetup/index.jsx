import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "./../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import ViewModal from "../../../../common/ViewModal";
import CalendarSetupModal from "./AddEditForm";
import ResetButton from "./../../../../common/ResetButton";
import FormikInput from "./../../../../common/FormikInput";
import * as Yup from "yup";
import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import NoResult from "./../../../../common/NoResult";
import { timeFormatter } from "../../../../utility/timeFormatter";
import ViewCalendarSetup from "./ViewDetails";
import "./calendarSetup.css";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AntTable from "../../../../common/AntTable";
import { gray600 } from "../../../../utility/customColor";

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
  }, []);

  // for create Modal
  const handleOpen = () => {
    setViewModal(false);
    setOpen(true);
  };
  const handleClose = () => {
    setViewModal(false);
    setOpen(false);
  };

  // for view Modal
  const handleViewOpen = () => {
    setViewModal(true);
    setOpen(false);
  };
  const handleViewClose = () => {
    setViewModal(false);
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  // single Data
  const [id, setId] = useState("");

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllLanding(
      "Calender",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading
    );
  }, [orgId, buId]);

  // search
  const filterData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
        regex.test(item?.CalenderName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch (e) {
      setRowDto([]);
    }
  };

  const saveHandler = (values) => {};

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 40) {
      permission = item;
    }
  });

  const columns = () => {
    return [
      {
        title: () => <span style={{ color: gray600 }}>SL</span>,
        render: (_, __, index) => index + 1,
        className: "text-center",
      },
      {
        title: "Calender Name",
        dataIndex: "CalenderName",
        sorter: true,
        filter: true,
      },
      {
        title: "Min. Work Hour",
        dataIndex: "MinWorkHour",
        render: (_, data) => <>{data?.MinWorkHour || "-"}</>,
        sorter: true,
        filter: true,
        isNumber: true,
        className: "text-center",
      },
      {
        title: () => (
          <span style={{ color: gray600 }}>Office Opening Time</span>
        ),
        dataIndex: "OfficeStartTime",
        render: (_, record) => (
          <span>
            {record?.OfficeStartTime
              ? timeFormatter(record?.OfficeStartTime)
              : "-"}
          </span>
        ),
      },
      {
        title: () => <span style={{ color: gray600 }}>Start Time</span>,

        render: (_, record) => (
          <span>
            {record?.StartTime ? timeFormatter(record?.StartTime) : "-"}
          </span>
        ),
      },
      {
        title: () => (
          <span style={{ color: gray600 }}>Extended Start Time</span>
        ),
        dataIndex: "ExtendedStartTime",
        render: (_, record) => (
          <span>
            {record?.ExtendedStartTime
              ? timeFormatter(record?.ExtendedStartTime)
              : "-"}
          </span>
        ),
      },
      {
        title: () => <span style={{ color: gray600 }}>Last Start Time</span>,
        dataIndex: "LastStartTime",
        render: (_, record) => (
          <span>
            {record?.LastStartTime ? timeFormatter(record?.LastStartTime) : "-"}
          </span>
        ),
      },

      // {
      //   title: () => <span style={{ color: gray600 }}>Break Start Time</span>,
      //   dataIndex: "dteBreakStartTime",
      //   render: (_, record) => (
      //     <span>
      //       {record?.dteBreakStartTime
      //         ? timeFormatter(record?.dteBreakStartTime)
      //         : "-"}
      //     </span>
      //   ),
      // },
      // {
      //   title: () => <span style={{ color: gray600 }}>Break End Time</span>,
      //   dataIndex: "dteBreakEndTime",
      //   render: (_, record) => (
      //     <span>
      //       {record?.dteBreakEndTime
      //         ? timeFormatter(record?.dteBreakEndTime)
      //         : "-"}
      //     </span>
      //   ),
      // },
      {
        title: () => <span style={{ color: gray600 }}>End Time</span>,
        render: (_, record) => (
          <span>{record?.EndTime ? timeFormatter(record?.EndTime) : "-"}</span>
        ),
      },
      {
        title: () => (
          <span style={{ color: gray600 }}>Office Closing Time</span>
        ),
        dataIndex: "OfficeCloseTime",
        render: (_, record) => (
          <span>
            {record?.OfficeCloseTime
              ? timeFormatter(record?.OfficeCloseTime)
              : "-"}
          </span>
        ),
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card calendarSetup-main">
                  <div className="table-card-heading">
                    <div className="total-result">
                      {rowDto?.length > 0 ? (
                        <>
                          <h6
                            style={{
                              fontSize: "14px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            Total {rowDto?.length} items
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
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px" }}
                              />
                            }
                            onClick={() => {
                              setRowDto(allData);
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li style={{ marginRight: "24px" }}>
                        <FormikInput
                          classes="search-input fixed-width"
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.search}
                          name="search"
                          type="text"
                          trailicon={
                            <SearchOutlined
                              sx={{
                                color: "#323232",
                                fontSize: "18px",
                              }}
                            />
                          }
                          onChange={(e) => {
                            filterData(e.target.value, allData, setRowDto);
                            setFieldValue("search", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
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

                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <AntTable
                          data={rowDto?.length > 0 && rowDto}
                          columnsData={columns()}
                          onRowClick={(dataRow) => {
                            if (!permission?.isEdit)
                              return toast.warn("You don't have permission");

                            setId(dataRow?.CalenderId);
                            setViewModal(true);
                          }}
                        />
                      ) : (
                        <>
                          {!loading && (
                            <NoResult title="No Result Found" para="" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
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
          setRowDto={setRowDto}
          setAllData={setAllData}
          setId={setId}
        />
      </ViewModal>
    </>
  );
}
