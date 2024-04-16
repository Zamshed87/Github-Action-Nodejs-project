/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddOutlined,
  CreateOutlined,
  DeleteOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../common/AntTable";
import FormikInput from "../../common/FormikInput";
import FormikSelect from "../../common/FormikSelect";
import IConfirmModal from "../../common/IConfirmModal";
import { LightTooltip } from "../../common/LightTooltip";
import Loading from "../../common/loading/Loading";
import NoResult from "../../common/NoResult";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../common/PrimaryButton";
import ResetButton from "../../common/ResetButton";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatterForInput } from "../../utility/dateFormatter";
import { customStyles } from "../../utility/newSelectCustomStyle";
import { stripHtml } from "../../utility/stripHTML";
import { yearDDLAction } from "../../utility/yearDDL";

import {
  deleteAnnouncement,
  filterData,
  getAllAnnouncement,
  getSingleAnnouncementDeleteData,
} from "./helper";
import "./index.css";

const initData = {
  search: "",
  year: {
    value: parseInt(moment().year()),
    label: moment().year(),
  },
};

const validationSchema = Yup.object().shape({});

/* const LightTooltip = styled(({ className, ...props }) => (
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
})); */

export default function AnnouncementCreate() {
  // hooks
  const history = useHistory();
  const scrollRef = useRef();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const [date, setDate] = useState({
    year: moment().year(),
  });

  const getData = () => {
    getAllAnnouncement(
      buId,
      orgId,
      setRowDto,
      setAllData,
      setLoading,
      employeeId,
      +date?.year
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Announcement";
  }, []);

  useEffect(() => {
    getAllAnnouncement(
      buId,
      orgId,
      setRowDto,
      setAllData,
      setLoading,
      employeeId,
      +date?.year
    );
  }, [buId, orgId, date?.year]);

  const demoPopup = (data) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: "Do you want to delete this announcement?",
      yesAlertFunc: () => {
        const payload = {
          announcement: {
            intAnnouncementId: data?.announcement?.intAnnouncementId,
          },
          announcementRow: data?.announcementRow?.map(() => {
            return {
              intAnnoucementId: data?.announcement?.intAnnouncementId,
            };
          }),
        };
        deleteAnnouncement(payload, setLoading, () => {
          getData();
        });
      },
      noAlertFunc: () => {
        // history.push("/components/dialogs")
      },
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 130) {
      permission = item;
    }
  });

  const columns = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
      },
      {
        title: "Announcement Title",
        dataIndex: "",
        render: (_, record) => (
          <div className="d-flex align-items-center justify-content-between">
            <LightTooltip title={record?.strTitle} arrow>
              <span className=" pointer">
                {record?.strTitle?.length > 15
                  ? record?.strTitle?.slice(0, 15) + "..."
                  : record?.strTitle}
              </span>
            </LightTooltip>
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Announcement Body",
        dataIndex: "LeaveTypeName",
        render: (_, record) => (
          <LightTooltip title={stripHtml(record?.strDetails)} arrow>
            <div className="pointer">
              {stripHtml(record?.strDetails.slice(0, 120))}
              {stripHtml(record?.strDetails.length > 120 ? "..." : "")}
            </div>
          </LightTooltip>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Publish Date",
        dataIndex: "dteCreatedAt",
        render: (data) => (
          <div className="pointer">{dateFormatterForInput(data)}</div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Expired Date",
        dataIndex: "dteExpiredDate",
        render: (data) => (
          <div className="pointer">{dateFormatterForInput(data)}</div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "",
        dataIndex: "",
        render: (data) => (
          <div className="d-flex align-items-center">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push({
                    pathname: `/administration/announcement/edit/${data?.intAnnouncementId}`,
                    state: data,
                  });
                }}
              >
                <CreateOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isClose)
                    return toast.warn("You don't have permission");
                  getSingleAnnouncementDeleteData(
                    data?.intAnnouncementId,
                    (res) => demoPopup(res)
                  );
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        ),
        sorter: false,
        filter: false,
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isCreate ? (
                <div
                  className="table-card announcement-wrapper"
                  ref={scrollRef}
                >
                  <div className="table-card-heading justify-content-end">
                    <ul className="d-flex flex-wrap">
                      {values?.search && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            styles={{
                              marginRight: "16px",
                            }}
                            onClick={() => {
                              setFieldValue("search", "");
                              resetForm();
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <FormikInput
                          classes="search-input fixed-width mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.search}
                          name="search"
                          type="text"
                          trailicon={
                            <SearchOutlined
                              sx={{ color: "#323232", fontSize: "18px" }}
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
                      <li className="pl-2">
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Announcement"}
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={() => {
                            if (!permission?.isCreate) {
                              return toast.warning(
                                "Your are not allowed to access",
                                {
                                  toastId: 11,
                                }
                              );
                            }
                            history.push("/administration/announcement/create");
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Year</label>
                          <FormikSelect
                            name="year"
                            options={yearDDLAction(5, 10) || []}
                            value={values?.year}
                            onChange={(valueOption) => {
                              setDate({
                                year: valueOption?.value,
                                month: "",
                              });
                              setFieldValue("year", valueOption);
                            }}
                            isClearable={false}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* <div className="col-lg-1">
                        <button
                          disabled={!values?.year}
                          style={{ marginTop: "21px" }}
                          className="btn btn-green"
                          onClick={() => {
                            getAllAnnouncement(
                              buId,
                              orgId,
                              setRowDto,
                              setAllData,
                              setLoading,
                              employeeId,
                              values?.year?.value
                            );
                          }}
                        >
                          View
                        </button>
                      </div> */}
                    </div>
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <AntTable
                          data={rowDto}
                          columnsData={columns(page, paginationSize)}
                          onRowClick={(item) => {
                            history.push({
                              pathname: `/administration/announcement/${item?.intAnnouncementId}`,
                              state: item,
                            });
                          }}
                          setPage={setPage}
                          setPaginationSize={setPaginationSize}
                        />
                      ) : (
                        <>{!loading && <NoResult />}</>
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
    </>
  );
}
