/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { IconButton, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Chips from "../../../../common/Chips";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ScrollableTable from "../../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { generateExcelAction } from "./excel/excelConvert";

import {
  salaryDetailsExcelColumn,
  salaryDetailsExcelData
} from "./excel/excelStyle";
import {
  getBuDetails,
  getColumnNameForReport,
  getCustomReportData
} from "./helper";

const initialValues = {
  search: "",
};

const validationSchema = Yup.object().shape({});

const EmployeeReportBuilder = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  // eslint-disable-next-line no-unused-vars
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [showingData, setShowingData] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  const [landingData, setLandingData] = useState([]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  /* 
        "menuReferenceId": 30329,
        "menuReferenceName": "Employee Report Builder",
  */
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30329) {
      permission = item;
    }
  });
  // useFormik hooks
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    getColumnNameForReport(setRowDto, setAllData, setShowingData, setLoading);
  }, []);

  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, [buId]);

  const selectedColumnHandler = (changedItem) => {
    const modifiedData = rowDto?.map((item) => {
      if (item?.value === changedItem?.value) {
        return {
          ...item,
          isSelected: !item?.isSelected,
        };
      } else {
        return item;
      }
    });
    setRowDto(modifiedData);
    setShowingData(modifiedData);
  };

  const selectedColumn = rowDto?.filter((item) => item?.isSelected === true);

  // drag and drop start
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const data = reorder(rowDto, result.source.index, result.destination.index);
    //store reordered state.
    setRowDto(data);
    setShowingData(data);
  };
  // drag and drop end

  // -----------------------old way--------------------
  // const arrayModify = (selectedColumn, landingData) => {
  //   let result = [];
  //   result = landingData.map((item) => {
  //     let newItem = {};

  //     for (let index = 0; index < selectedColumn.length; index++) {
  //       let element = selectedColumn[index];
  //       if (element?.value?.includes("dte")) {
  //         newItem = {
  //           ...newItem,
  //           [element?.value]: dateFormatter(item[element?.value]),
  //         };
  //       } else {
  //         newItem = {
  //           ...newItem,
  //           [element?.value]: item[element?.value],
  //         };
  //       }
  //     }
  //     return newItem;
  //   });

  //   return result;
  // };

  //------------------new way-----------------------
  const arrayModify = (selectedColumn, landingData) => {
    const result = landingData.map((item) =>
      selectedColumn.reduce((newItem, { value }) => {
        if (value.includes("dte")) {
          newItem[value] = dateFormatter(item[value]);
        } else {
          newItem[value] = item[value];
        }
        return newItem;
      }, {})
    );
    return result;
  };

  const result = arrayModify(selectedColumn, landingData);

  // excel start
  const tableColumn = selectedColumn?.map((itm) => itm?.value);
  const tableDataColumn = selectedColumn?.map((itm) => itm?.value);
  const dynamicTableHeader = (tableHeader, tableRow) => {
    let newArr = [];

    for (let index = 0; index < tableRow.length; index++) {
      let element = tableRow[index];
      newArr = {
        ...newArr,
        [element?.value]: element?.label,
      };
    }
    return newArr;
  };

  // excel column set up
  const excelColumnFunc = (processId) => {
    switch (processId) {
      default:
        return {
          ...salaryDetailsExcelColumn,
          ...dynamicTableHeader(tableColumn, selectedColumn),
        };
    }
  };
  // excel data set up
  const excelDataFunc = (processId) => {
    switch (processId) {
      default:
        return salaryDetailsExcelData(tableDataColumn, result);
    }
  };

  // excel end

  // search
  const filterData = (keywords, allData, setShowingData) => {
    if (!keywords) {
      setShowingData(rowDto);
      return;
    }
    const lowercaseKeywords = keywords.toLowerCase();
    const filteredData = allData.filter(({ label }) =>
      label.toLowerCase().includes(lowercaseKeywords)
    );
    setShowingData(filteredData);
  };

  return (
    <div style={{ height: "100vh !important" }}>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card" style={{ marginTop: "45px" }}>
            <div className="table-card-body">
              <div
                className="card-style d-flex row p-3"
                style={{ height: "30vh", overflow: "auto" }}
              >
                <div className="col-3">
                  <h1>
                    Select Column Name{" "}
                    <span style={{ fontSize: "10px" }}>(Draggable)</span>:{" "}
                  </h1>
                  <div className="pt-3">
                    <DefaultInput
                      classes="search-input fixed-width tableCardHeaderSeach"
                      inputClasses="search-inner-input"
                      placeholder="Search Column Name"
                      value={values?.search}
                      name="search"
                      type="text"
                      trailicon={<SearchOutlined sx={{ color: "#323232" }} />}
                      onChange={(e) => {
                        filterData(e.target.value, allData, setShowingData);
                        setFieldValue("search", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                    <div>
                      <Droppable droppableId="AllQuestion">
                        {(queDropProvided) => (
                          <div
                            ref={queDropProvided.innerRef}
                            {...queDropProvided.droppableProps}
                          >
                            {showingData?.map((item, index) => {
                              return (
                                <Draggable
                                  key={index}
                                  draggableId={index.toString()}
                                  index={index}
                                >
                                  {(queProvided, index) => (
                                    <div
                                      ref={queProvided.innerRef}
                                      {...queProvided.draggableProps}
                                      {...queProvided.dragHandleProps}
                                      index={index}
                                    >
                                      <DragIndicatorIcon
                                        sx={{ fontSize: "12px" }}
                                      />
                                      <Chips
                                        key={index}
                                        label={item?.label}
                                        style={{
                                          cursor: "pointer",
                                          marginRight: "5px",
                                          marginTop: "10px",
                                        }}
                                        classess={
                                          item?.isSelected
                                            ? "success"
                                            : "secondary"
                                        }
                                        onClick={() =>
                                          selectedColumnHandler(item)
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}

                            {queDropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </DragDropContext>
                </div>
                <div className="col-1">
                  <hr
                    style={{
                      border: "1px solid black",
                      height: "100%",
                      width: "0px",
                    }}
                  />
                </div>
                <div className="col-4">
                  <h1>Selected Column Name Serial: </h1>
                  <ul>
                    {selectedColumn?.length > 0 ? (
                      selectedColumn.map((item, index) => (
                        <li key={index} style={{ display: "inline-block" }}>
                          <Chips
                            label={`${index + 2}. ${item?.label}`}
                            classess={
                              item?.isSelected ? "success" : "secondary"
                            }
                            style={{
                              marginRight: "5px",
                              marginTop: "5px",
                            }}
                            isDeleteClick={() => selectedColumnHandler(item)}
                          />
                        </li>
                      ))
                    ) : (
                      <li style={{ marginTop: "-38px" }}>
                        <NoResult title="No Column Selected" />
                      </li>
                    )}
                  </ul>
                </div>
                <div className="col-1">
                  <hr
                    style={{
                      border: "1px solid black",
                      height: "100%",
                      width: "0px",
                    }}
                  />
                </div>
                <div className="col-3 d-flex justify-content-end">
                  <button
                    style={{ position: "fixed" }}
                    className="btn btn-green"
                    onClick={() => {
                      getCustomReportData(
                        orgId,
                        buId,
                        setLandingData,
                        setLoading
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {selectedColumn?.length > 0 && result?.length > 0 ? (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <h2
                    style={{
                      color: gray500,
                      fontSize: "14px",
                      margin: "15px 0px",
                    }}
                  >
                    Employee Custom Report
                  </h2>

                  <ul className="d-flex flex-wrap justify-content-between align-items-center pt-3">
                    <li>
                      <p className="mr-1">Download Excel</p>
                    </li>
                    <li
                      className=""
                      onClick={(e) => {
                        e.stopPropagation();
                        const excelLanding = () => {
                          generateExcelAction(
                            "Master Report",
                            "",
                            "",
                            excelColumnFunc(0),
                            excelDataFunc(0),
                            buDetails?.strBusinessUnit,
                            0,
                            result,
                            tableColumn,
                            moment(values?.monthYear).format("MMMM-YYYY"),
                            buDetails?.strBusinessUnitAddress
                          );
                        };
                        excelLanding();
                      }}
                    >
                      <Tooltip title="Export CSV" arrow>
                        <IconButton style={{ color: "#101828" }}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </li>
                    {/* {values?.search && (
                      <li>
                        <ResetButton
                          classes="btn-filter-reset"
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{
                                marginRight: "10px",
                                fontSize: "16px",
                              }}
                            />
                          }
                          styles={{
                            marginRight: "16px",
                          }}
                          onClick={() => {
                            // setRowDto(employeeList);
                            setFieldValue("search", "");
                          }}
                        />
                      </li>
                    )}
                    <li>
                      <DefaultInput
                        classes="search-input"
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
                          // filterData(e.target.value);
                          setFieldValue("search", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </li> */}
                  </ul>
                </div>
                <div>
                  <ScrollableTable
                    classes="salary-process-table salary-generate-table"
                    secondClasses="table-card-styled tableOne scroll-table-height report-scroll-table-height"
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>
                          <div>SL</div>
                        </th>

                        {selectedColumn?.map((item, index) => {
                          return (
                            <th style={{ width: "120px" }}>
                              <div>{item?.label}</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {result?.map((item, index) => (
                        <tr
                          className="hasEvent"
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <td>
                            <div className="tableBody-title">{index + 1}</div>
                          </td>
                          {selectedColumn?.length > 0 &&
                            selectedColumn?.map((itm, index) => (
                              <td key={index}>
                                <div className="tableBody-title">
                                  {item[itm?.value]}
                                </div>
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </ScrollableTable>
                </div>
              </>
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </div>
  );
};

export default EmployeeReportBuilder;
