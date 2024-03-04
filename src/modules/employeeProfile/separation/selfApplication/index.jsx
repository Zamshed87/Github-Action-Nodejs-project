/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import {
  InfoOutlined,
  SettingsBackupRestoreOutlined,
  EditOutlined,
  FilePresentOutlined,
  AddOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import Loading from "../../../../common/loading/Loading";
import NoResultTwo from "../../../../common/NoResultTwo";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import ResetButton from "../../../../common/ResetButton";
import Chips from "../../../../common/Chips";
import { gray500, gray700, gray900 } from "../../../../utility/customColor";
import { getSeparationLanding } from "../helper";
import {
  dateFormatter,
  monthFirstDate,
} from "./../../../../utility/dateFormatter";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import AntTable from "../../../../common/AntTable";
import { LightTooltip } from "../../LoanApplication/helper";
import { paginationSize } from "../../../../common/peopleDeskTable";
import { todayDate } from "utility/todayDate";
import { PModal } from "Components/Modal";
import ManagementSeparationHistoryView from "../mgmApplication/viewForm/ManagementSeparationHistoryView";

const initData = {
  status: "",
};

export default function SelfSeparation() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [, setAllData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, [dispatch]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = () => {
    getSeparationLanding(
      "EmployeeSeparationList",
      buId,
      wgId,
      monthFirstDate(),
      todayDate(),
      0, // Status 0 means All
      "",
      setRowDto,
      setLoading,
      pages?.current,
      pages?.pageSize,
      setPages,
      wId
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    // validationSchema: validationSchema,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      resetForm(initData);
    },
  });

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card businessUnit-wrapper dashboard-scroll">
          <div className="table-card-heading">
            <div>
              <h6>Separation</h6>
            </div>
            <ul className="d-flex flex-wrap">
              {status && (
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
                      setFieldValue("status", "");
                      setStatus("");
                      getData();
                    }}
                  />
                </li>
              )}
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Apply"}
                  icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push("/SelfService/separation/application/create");
                  }}
                />
              </li>
            </ul>
          </div>
          <div className="table-card-body">
            <div className="table-card-styled tableOne">
              {rowDto?.length > 0 ? (
                <>
                  <div className="table-card-styled tableOne employee-table-card tableOne  table-responsive">
                    <AntTable
                      data={rowDto}
                      columnsData={empSeparationDtoCol(
                        dispatch,
                        history,
                        setOpenModal,
                        setId
                      )}
                      rowClassName="pointer"
                      removePagination
                      onRowClick={(item) => {
                        history.push(
                          `/SelfService/separation/application/view/${item?.separationId}`
                        );
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {!loading && (
                    <NoResultTwo
                      title="You have no application. "
                      to="/SelfService/separation/application/create"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </form>
      <PModal
        title="Separation History View"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        components={<ManagementSeparationHistoryView id={id} type="view" />}
        width={1000}
      />
    </>
  );
}
const empSeparationDtoCol = (dispatch, history, setOpenModal, setId) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 20,
    },
    {
      title: "Separation Type",
      dataIndex: "strIOUCode",
      sorter: true,
      render: (_, item) => {
        return (
          <div>
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
                        __html: item?.Reason,
                      }}
                    />
                    {item?.docArr?.length
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
            <span className="ml-2"></span>
            {item?.strSeparationTypeName}
          </div>
        );
      },
    },
    {
      title: "Application Date",
      dataIndex: "SeparationDate",
      isDate: true,
      sorter: true,
      render: (_, record) => dateFormatter(record?.dteSeparationDate),
    },
    {
      title: "Late Working Date",
      dataIndex: "dteFromDate",
      isDate: true,
      sorter: true,
      render: (_, record) => dateFormatter(record?.dteLastWorkingDate),
    },
    {
      title: "Status",
      dataIndex: "Status",
      width: 100,
      render: (_, item) => {
        return (
          <div>
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
                <Chips label="Released" classess="p-2 mr-2" />
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, item) => {
        return (
          <div className="d-flex">
            <Tooltip title="View" arrow>
              <button className="iconButton" type="button">
                <VisibilityOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setId(item?.separationId);
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
                      history.push(
                        `/SelfService/separation/application/edit/${item?.separationId}`
                      );
                    }}
                  />
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
};
