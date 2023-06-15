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
} from "@mui/icons-material";
import Loading from "../../../../common/loading/Loading";
import NoResultTwo from "../../../../common/NoResultTwo";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import ResetButton from "../../../../common/ResetButton";
import Chips from "../../../../common/Chips";
import { gray500, gray700, gray900 } from "../../../../utility/customColor";
import { getSeparationLanding } from "../helper";
import { dateFormatter } from "./../../../../utility/dateFormatter";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import AntTable from "../../../../common/AntTable";
import { LightTooltip } from "../../LoanApplication/helper";
import PeopleDeskTable, { paginationSize } from "../../../../common/peopleDeskTable";

const initData = {
  status: "",
};

export default function SelfSeparation() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const getData = (pagination, searchText) => {
    getSeparationLanding(
      "EmployeeSeparationList",
      buId,
      wgId,
      "",
      "",
      "",
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      employeeId
    );
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      }
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      }
    );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, [dispatch]);




  useEffect(() => {
    getSeparationLanding(
      "EmployeeSeparationList",
      buId,
      wgId,
      "",
      "",
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      employeeId
    );
  }, [buId, wgId, employeeId]);

  const { setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      resetForm(initData);
    },
  });

  const empSeparationDtoCol = (
    page,
    paginationSize,
    dispatch,
    history
  ) => {
    return [
      {
        title: "SL",
        render: (_, index) => (page - 1) * paginationSize + index + 1,
        sort: false,
        filter: false,
        className: "text-center",
        width: 30
      },
      {
        title: "Separation Type",
        dataIndex: "strSeparationTypeName",
        sort: true,
        render: (item) => {
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
                          __html: item?.strReason,
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
        filter: false,
        fieldType: "string",
      },
      {
        title: "Application Date",
        dataIndex: "dteSeparationDate",
        sort: true,
        render: (record) => dateFormatter(record?.dteSeparationDate),
        filter: false,
        fieldType: "date",
      },
      {
        title: "Late Working Date",
        dataIndex: "dteLastWorkingDate",
        sort: true,
        filter: false,
        fieldType: "date",
        render: (record) => dateFormatter(record?.dteLastWorkingDate),
      },
      {
        title: "Status",
        dataIndex: "approvalStatus",
        width: 100,
        render: (item) => {
          return (
            <div>
              {item?.approvalStatus === "Approved" && (
                <Chips label="Approved" classess="success p-2" />
              )}
              {item?.approvalStatus === "Pending" && (
                <Chips label="Pending" classess="warning p-2" />
              )}
              {item?.approvalStatus === "Process" && (
                <Chips label="Process" classess="primary p-2" />
              )}
              {item?.approvalStatus === "Rejected" && (
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
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "",
        dataIndex: "action",
        render: (item) => {
          return (
            <div className="d-flex">
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
        sort: true,
        filter: false,
        fieldType: "string",
      },
    ];
  };

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
                  <PeopleDeskTable
                    customClass="iouManagementTable"
                    columnData={empSeparationDtoCol(
                      pages?.current,
                      pages?.pageSize,
                      dispatch,
                      history,
                    )}
                    pages={pages}
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    handleChangePage={(e, newPage) =>
                      handleChangePage(e, newPage, "")
                    }
                    handleChangeRowsPerPage={(e) =>
                      handleChangeRowsPerPage(e, "")
                    }
                    uniqueKey="strEmployeeCode"
                    isCheckBox={false}
                    isScrollAble={false}
                    onRowClick={(data) => {
                      history.push(
                        `/profile/separation/view/${data?.separationId}`
                      );
                    }}
                  />
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
    </>
  );
}
