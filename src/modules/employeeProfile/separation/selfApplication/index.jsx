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

const initData = {
  status: "",
};

export default function SelfSeparation() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [, setAllData] = useState([]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, [dispatch]);

  const getData = () => {
    getSeparationLanding({
      status: null,
      depId: null,
      desId: null,
      supId: null,
      empId: employeeId,
      workId: null,
      buId,
      orgId,
      setter: setRowDto,
      setLoading,
      separationTypeId: null,
      setAllData,
      tableName: "EmployeeSeparationList",
    });
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
                      columnsData={empSeparationDtoCol(dispatch, history)}
                      rowClassName="pointer"
                      removePagination
                      onRowClick={(item) => {
                        history.push(
                          `/SelfService/separation/application/view/${item?.SeparationId}`
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
    </>
  );
}
const empSeparationDtoCol = (dispatch, history) => {
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
            {item?.SeparationTypeName}
          </div>
        );
      },
    },
    {
      title: "Application Date",
      dataIndex: "SeparationDate",
      isDate: true,
      sorter: true,
      render: (_, record) => dateFormatter(record?.SeparationDate),
    },
    {
      title: "Late Working Date",
      dataIndex: "dteFromDate",
      isDate: true,
      sorter: true,
      render: (_, record) => dateFormatter(record?.LastWorkingDay),
    },
    {
      title: "Status",
      dataIndex: "Status",
      width: 100,
      render: (_, item) => {
        return (
          <div>
            {item?.ApprovalStatus === "Approve" && (
              <Chips label="Approved" classess="success p-2" />
            )}
            {item?.ApprovalStatus === "Pending" && (
              <Chips label="Pending" classess="warning p-2" />
            )}
            {item?.ApprovalStatus === "Process" && (
              <Chips label="Process" classess="primary p-2" />
            )}
            {item?.ApprovalStatus === "Reject" && (
              <>
                <Chips label="Rejected" classess="danger p-2 mr-2" />
              </>
            )}
            {item?.ApprovalStatus === "Released" && (
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
            {item?.ApprovalStatus === "Pending" && (
              <Tooltip title="Edit" arrow>
                <button className="iconButton" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        `/SelfService/separation/application/edit/${item?.SeparationId}`
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

/*  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>
                          <div
                            className="d-flex align-items-center pointer"
                            onClick={() => {
                              setSeparationOrder(
                                separationTypeOrder === "desc" ? "asc" : "desc"
                              );
                              commonSortByFilter(
                                separationTypeOrder,
                                "SeparationTypeName"
                              );
                            }}
                          >
                            Separation Type
                            <div>
                              <SortingIcon
                                viewOrder={separationTypeOrder}
                              ></SortingIcon>
                            </div>
                          </div>
                        </th>
                        <th>
                          <div
                            className="d-flex align-items-center pointer"
                            onClick={() => {
                              setApplicationDateOrder(
                                aplicationDateOrder === "desc" ? "asc" : "desc"
                              );
                              commonSortByFilter(
                                aplicationDateOrder,
                                "SeparationDate"
                              );
                            }}
                          >
                            Application Date
                            <div>
                              <SortingIcon
                                viewOrder={aplicationDateOrder}
                              ></SortingIcon>
                            </div>
                          </div>
                        </th>
                        <th>
                          <div
                            className="d-flex align-items-center pointer"
                            onClick={() => {
                              setLastWorkingDateOrder(
                                lastWorkingDateOrder === "desc" ? "asc" : "desc"
                              );
                              commonSortByFilter(
                                lastWorkingDateOrder,
                                "LastWorkingDay"
                              );
                            }}
                          >
                            Late Working Date
                            <div>
                              <SortingIcon
                                viewOrder={lastWorkingDateOrder}
                              ></SortingIcon>
                            </div>
                          </div>
                        </th>
                        <th style={{ width: "105px" }}>
                          <div className="table-th d-flex align-items-center">
                            Status
                            <span>
                              <Select
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none !important",
                                  },
                                  "& .MuiSelect-select": {
                                    paddingRight: "22px !important",
                                    marginTop: "-15px",
                                  },
                                }}
                                className="selectBtn"
                                name="status"
                                IconComponent={ArrowDropDown}
                                value={values?.status}
                                onChange={(e) => {
                                  setFieldValue("status", "");
                                  setStatus(e.target.value?.label);
                                  statusTypeFilter(e.target.value?.label);
                                }}
                              >
                                {statusDDL?.length > 0 &&
                                  statusDDL?.map((item, index) => {
                                    return (
                                      <MenuItem key={index} value={item}>
                                        {item?.label}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            </span>
                          </div>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => {
                        return (
                          <tr
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              history.push(
                                `/SelfService/separation/application/view/${item?.SeparationId}`
                              );
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <td>
                              <p className="tableBody-title pl-1">
                                {index + 1}
                              </p>
                            </td>
                            <td>
                              <div className="content tableBody-title">
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
                                                    dispatch(
                                                      getDownlloadFileView_Action(
                                                        image
                                                      )
                                                    );
                                                  }}
                                                >
                                                  <>
                                                    <FilePresentOutlined />{" "}
                                                    {`Attachment_${i + 1}`}
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
                                {item?.SeparationTypeName}
                              </div>
                            </td>
                            <td>
                              <div className="content tableBody-title">
                                {dateFormatter(item?.SeparationDate)}
                              </div>
                            </td>
                            <td>
                              <div className="content tableBody-title">
                                {dateFormatter(item?.LastWorkingDay)}
                              </div>
                            </td>
                            <td>
                              {item?.ApprovalStatus === "Approve" && (
                                <Chips
                                  label="Approved"
                                  classess="success p-2"
                                />
                              )}
                              {item?.ApprovalStatus === "Pending" && (
                                <Chips label="Pending" classess="warning p-2" />
                              )}
                              {item?.ApprovalStatus === "Process" && (
                                <Chips label="Process" classess="primary p-2" />
                              )}
                              {item?.ApprovalStatus === "Reject" && (
                                <>
                                  <Chips
                                    label="Rejected"
                                    classess="danger p-2 mr-2"
                                  />
                                </>
                              )}
                              {item?.ApprovalStatus === "Released" && (
                                <>
                                  <Chips label="Released" classess="p-2 mr-2" />
                                </>
                              )}
                            </td>
                            <td width="60px">
                              <div className="d-flex">
                                {item?.ApprovalStatus === "Pending" && (
                                  <Tooltip title="Edit" arrow>
                                    <button
                                      className="iconButton"
                                      type="button"
                                    >
                                      <EditOutlined
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          history.push(
                                            `/SelfService/separation/application/edit/${item?.SeparationId}`
                                          );
                                        }}
                                      />
                                    </button>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table> */
