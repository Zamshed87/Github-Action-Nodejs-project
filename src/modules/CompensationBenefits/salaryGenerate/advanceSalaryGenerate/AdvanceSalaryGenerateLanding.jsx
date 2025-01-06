import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import FormikSelect from "common/FormikSelect";
import { getPeopleDeskAllDDL } from "common/api";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import * as Yup from "yup";
import NoResult from "common/NoResult";
import ResetButton from "common/ResetButton";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import {
  compensationBenefitsLSAction,
  setFirstLevelNameAction,
} from "commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "utility/customColor";
import { dateFormatter, getDateOfYear } from "utility/dateFormatter";
import { getMonthName } from "utility/monthUtility";
import { numberWithCommas } from "utility/numberWithCommas";
import { customStyles } from "utility/selectCustomStyle";
import {
  createSalaryGenerateRequest,
  getSalaryGenerateRequestLanding,
} from "./helper";
import { Popover, Tag, Tooltip } from "antd";
import { downloadFile } from "utility/downloadFile";
import { DataTable, Flex } from "Components";
import { getSerial } from "Utils";
import { DownloadOutlined } from "@ant-design/icons";
import useDebounce from "utility/customHooks/useDebounce";
import MasterFilter from "common/MasterFilter";
import DefaultInput from "common/DefaultInput";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const initialValues = {
  salaryTpe: {
    value: "Salary",
    label: "Full Salary",
  },
  businessUnit: "",
  workplaceGroup: "",
  // workplace: "",
  description: "",
  monthYear: moment().format("YYYY-MM"),
  payrollGroup: "",
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
  fromDate: "",
  toDate: "",
  search: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
  salaryCode: "",
};

const validationSchema = Yup.object().shape({
  businessUnit: Yup.object().shape({
    value: Yup.string().required("Business Unit is required"),
    label: Yup.string().required("Business Unit is required"),
  }),
  workplaceGroup: Yup.object().shape({
    value: Yup.string().required("Workplace Group is required"),
    label: Yup.string().required("Workplace Group is required"),
  }),
  workplace: Yup.object().shape({
    value: Yup.string().required("Workplace is required"),
    label: Yup.string().required("Workplace is required"),
  }),
  payrollGroup: Yup.object().shape({
    value: Yup.string().required("Payroll Group is required"),
    label: Yup.string().required("Payroll Group is required"),
  }),
  monthYear: Yup.date().required("Payroll month is required"),
});

const AdvanceSalaryGenerateLanding = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const debounce = useDebounce();
  const [loading, setLoading] = useState(false);
  const [singleData] = useState(null);
  // const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  const [paginationSize] = useState(15);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [salaryCodeDDL, getSalaryCodeAPI, , setSalaryCodeDDL] = useAxiosPost(
    []
  );
  const [rowDto, getLanding, , setRowDto] = useAxiosGet([]);

  // for create state
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const {
    profileData: { orgId, buId, employeeId, wgId, wId },
  } = useSelector((state) => state?.auth, shallowEqual);

  // LS data compensationBenefits
  const { compensationBenefits } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  //get landing data
  const getLandingData = (values, pagination = pages) => {
    // getSalaryGenerateRequestLanding(
    //   "SalaryGenerateRequestLanding",
    //   orgId,
    //   buId,
    //   wgId,
    //   wId,
    //   "",
    //   "",
    //   values?.filterFromDate,
    //   values?.filterToDate,
    //   setRowDto,
    //   setAllData,
    //   setLoading,
    //   pagination,
    //   setPages,
    //   undefined,
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   values
    // );
    getLanding(
      `AdvanceSalary/AdvanceSalary?fromDate=${values?.filterFromDate}&toDate=${values?.filterToDate}`
    );
  };

  useEffect(() => {
    getLandingData(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId, wgId]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.filter(
        (item) =>
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strSalaryCode?.toLowerCase()) ||
          regex.test(item?.ProcessionStatus?.toLowerCase()) ||
          regex.test(item?.ApprovalStatus?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // for initial
  useEffect(() => {
    setWorkplaceDDL([]);
    setSalaryCodeDDL([]);
    setFieldValue("salaryCode", "");
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${0}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  // useFormik hooks
  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    // setValues,
    // setFieldValues,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      filterFromDate:
        compensationBenefits?.salaryGenerate?.fromDate ||
        getDateOfYear("first"),
      filterToDate:
        compensationBenefits?.salaryGenerate?.toDate || getDateOfYear("last"),
    },
    onSubmit: () => {
      return;
    },
  });

  // on form submit

  // send for approval
  const sendForApprovalHandler = (data) => {
    const payload = {
      strPartName: "GeneratedSalarySendForApproval",
      intSalaryGenerateRequestId: data?.intSalaryGenerateRequestId,
      strSalaryCode: data?.strSalaryCode,
      intAccountId: data?.intAccountId,
      intBusinessUnitId: data?.intBusinessUnitId,
      strBusinessUnit: data?.strBusinessUnit,
      intWorkplaceGroupId: wgId,
      intMonthId: data?.intMonth,
      intYearId: data?.intYear,
      strDescription: data?.strDescription,
      intCreatedBy: employeeId,
    };
    const callback = () => {
      getLandingData(values);
    };
    createSalaryGenerateRequest(payload, setLoading, callback);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 77) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Salary Generate";
  }, [dispatch]);

  const salaryGenerateColumn = (pagination) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          getSerial({
            currentPage: pagination?.current,
            pageSize: pagination?.pageSize,
            index,
          }),
        sorter: false,
        filter: false,
        width: 30,
      },
      {
        title: "Salary Code",
        dataIndex: "advanceSalaryCode",
        render: (text) => {
          return (
            <div className="d-flex align-items-center">
              <p>{text}</p>
            </div>
          );
        },
        filter: true,
        width: 180,
      },
      {
        title: "Workplace Group",
        dataIndex: "workplaceGroupName",
        width: 120,
      },
      {
        title: "Workplaces",
        render: (text) =>
          text ? (
            <Popover
              placement="bottom"
              content={() => {
                const textArr = text.split(",");

                return (
                  <ol className="ml-2">
                    {textArr.map((item, index) => {
                      return <li key={index}>{item}</li>;
                    })}
                  </ol>
                );
              }}
              trigger="hover"
            >
              {text.substring(0, 15) + "...."}
            </Popover>
          ) : (
            "-"
          ),
        dataIndex: "workplaceName",
        width: 150,
      },

      {
        title: "Payroll Month",
        dataIndex: "payrollMonth",
        // sorter: false,
        // filter: false,
        // render: (_, item) => (
        //   <>{`${getMonthName(item?.payrollMonth)}, ${item?.intYear}`}</>
        // ),
        width: 100,
      },
      // {
      //   title: "Payroll Period",
      //   dataIndex: "strDepartment",
      //   sorter: false,
      //   filter: false,
      //   render: (_, item) => {
      //     return (
      //       <>
      //         {item?.dteSalaryGenerateFrom
      //           ? dateFormatter(item?.dteSalaryGenerateFrom)
      //           : "-"}{" "}
      //         -{" "}
      //         {item?.dteSalaryGenerateTo
      //           ? dateFormatter(item?.dteSalaryGenerateTo)
      //           : "-"}
      //       </>
      //     );
      //   },
      //   width: 200,
      // },
      // {
      //   title: "Net Amount",
      //   dataIndex: "netAmount",
      //   // render: (_, record) => (
      //   //   <>
      //   //     {record?.numNetPayableSalary
      //   //       ? numberWithCommas(record?.numNetPayableSalary)
      //   //       : "0"}
      //   //   </>
      //   // ),
      //   width: 100,
      //   className: "text-right",
      // },
      // {
      //   title: "Processing Status",
      //   dataIndex: "ProcessionStatus",
      //   className: "text-center",
      //   render: (_, item) => {
      //     return (
      //       <Flex align="center" gap="8px">
      //         <Tooltip title="Download as Excel" arrow>
      //           <button
      //             className="btn-save ml-2"
      //             type="button"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_Excel?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${item?.intMonth}&intYearId=${item?.intYear}&strSalaryCode=${item?.strSalaryCode}&strHrPositionList=&intPaymentMethod=`;

      //               downloadFile(
      //                 url,
      //                 "Salary Details Report",
      //                 "xlsx",
      //                 setLoading
      //               );
      //             }}
      //             style={{
      //               border: "transparent",
      //               width: "30px",
      //               height: "30px",
      //               background: "#f2f2f7",
      //               borderRadius: "100px",
      //             }}
      //           >
      //             <DownloadOutlined />
      //           </button>
      //         </Tooltip>
      //         <div>
      //           {item?.ProcessionStatus === "Success" && (
      //             <Tag style={{ borderRadius: "50px" }} color="green">
      //               {item?.ProcessionStatus}
      //             </Tag>
      //           )}
      //           {item?.ProcessionStatus === "Processing" && (
      //             <Tag style={{ borderRadius: "50px" }} color="gold">
      //               {item?.ProcessionStatus}
      //             </Tag>
      //           )}
      //         </div>
      //       </Flex>
      //     );
      //   },
      //   width: 130,
      // },
      // {
      //   title: "Approval Status",
      //   dataIndex: "ApprovalStatus",
      //   sorter: true,
      //   filter: false,
      //   width: 140,
      //   render: (_, item) => {
      //     return (
      //       <>
      //         {item?.ApprovalStatus === "Approved" && (
      //           <p
      //             style={{
      //               fontSize: "12px",
      //               color: gray500,
      //               fontWeight: "400",
      //             }}
      //           >
      //             {item?.ApprovalStatus}
      //           </p>
      //         )}
      //         {item?.ApprovalStatus === "Send for Approval" && (
      //           <button
      //             style={{
      //               height: "24px",
      //               fontSize: "10px",
      //               padding: "0px 12px 0px 12px",
      //               backgroundColor: "#0BA5EC",
      //             }}
      //             className="btn btn-default"
      //             type="button"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               sendForApprovalHandler(item);
      //             }}
      //           >
      //             Send for Approval
      //           </button>
      //         )}
      //         {item?.ApprovalStatus === "Waiting for Approval" && (
      //           <p
      //             style={{
      //               fontSize: "12px",
      //               color: gray500,
      //               fontWeight: "400",
      //             }}
      //           >
      //             {item?.ApprovalStatus}
      //           </p>
      //         )}
      //         {item?.ApprovalStatus === "Rejected" && (
      //           <p
      //             style={{
      //               fontSize: "12px",
      //               color: gray500,
      //               fontWeight: "400",
      //             }}
      //           >
      //             {item?.ApprovalStatus}
      //           </p>
      //         )}
      //       </>
      //     );
      //   },
      // },
      {
        title: "",
        dataIndex: "",
        sorter: false,
        filter: false,
        width: 125,
        render: (data, item) => (
          <>
            {/* {!!item?.isReGenerate && ( */}
            {!!true && (
              <div>
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push({
                      pathname: `/compensationAndBenefits/payrollProcess/advanceSalaryGenerate/edit/${item?.advanceSalaryCode}`,
                      state: item,
                    });
                  }}
                >
                  Re-Generate
                </button>
              </div>
            )}
          </>
        ),
      },
    ];
  };
  // const getSalaryCodeByFromDateAndWId = (fromDate, toDate) => {
  //   getSalaryCodeAPI(`/Payroll/GetSalaryCode`, {
  //     fromDate: fromDate,
  //     toDate: toDate,
  //     workPlaceId: (workplaceDDL || []).map((w) => w?.intWorkplaceId),
  //   });
  // };
  useEffect(() => {
    if (workplaceDDL?.length > 0) {
      // getSalaryCodeByFromDateAndWId(
      //   values?.filterFromDate,
      //   values?.filterToDate
      // );
    }
  }, [workplaceDDL]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading justify-content-between align-items-center">
              <h2> Generate List</h2>
              <ul className="d-flex flex-wrap">
                {values?.search && (
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
                        setRowDto(allData);
                        setFieldValue("search", "");
                      }}
                    />
                  </li>
                )}
                <li>
                  <MasterFilter
                    isHiddenFilter
                    styles={{
                      marginRight: "0px",
                    }}
                    width="100%"
                    inputWidth="200px"
                    value={values?.search}
                    setValue={(value) => {
                      setFieldValue("search", value);
                      debounce(() => {
                        filterData(value);
                      }, 500);
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      filterData("");
                    }}
                  />
                </li>
                <li>
                  <button
                    type="button"
                    style={{
                      padding: "0px 10px",
                      marginLeft: "16px",
                    }}
                    className="btn btn-default"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        "/compensationAndBenefits/payrollProcess/advanceSalaryGenerate/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-style pb-0 mt-3 mb-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterFromDate}
                      placeholder="Month"
                      name="toDate"
                      max={values?.filterToDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterFromDate", e.target.value);
                        setSalaryCodeDDL([]);
                        if (e.target.value && values?.filterToDate && wId) {
                          // getSalaryCodeByFromDateAndWId(
                          //   e.target.value,
                          //   values?.filterToDate,
                          //   wId
                          // );
                        }
                        // for saving date to local storage
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            salaryGenerate: {
                              ...compensationBenefits?.salaryGenerate,
                              fromDate: e.target.value,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterToDate}
                      placeholder="Month"
                      name="toDate"
                      min={values?.filterFromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterToDate", e.target.value);
                        setSalaryCodeDDL([]);
                        // if (e.target.value && values?.filterToDate && wId) {
                        //   getSalaryCodeByFromDateAndWId(
                        //     values?.filterFromDate,
                        //     e.target.value,
                        //     wId
                        //   );
                        // }
                        // for saving date to local storage
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            salaryGenerate: {
                              ...compensationBenefits?.salaryGenerate,
                              toDate: e.target.value,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <div className="input-field-main">
                    <label>Salary Code</label>
                    <FormikSelect
                      name="salaryCode"
                      options={salaryCodeDDL || []}
                      value={values?.salaryCode}
                      onChange={(valueOption) => {
                        setFieldValue("salaryCode", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={singleData}
                    />
                  </div>
                </div> */}
                {/* removed for requiremnt change....... */}
                {/* <div className="col-md-3 d-none">
                  <div className="input-field-main">
                    <label>Workplace</label>
                    <FormikSelect
                      name="workplace"
                      isClearable={false}
                      options={workplaceDDL || []}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        setFieldValue("workplace", valueOption);
                      }}
                      styles={{
                        ...customStyles,
                        control: (provided) => ({
                          ...provided,
                          minHeight: "auto",
                          height:
                            values?.workplace?.length > 1 ? "auto" : "auto",
                          borderRadius: "4px",
                          boxShadow: `${success500}!important`,
                          ":hover": {
                            borderColor: `${gray600}!important`,
                          },
                          ":focus": {
                            borderColor: `${gray600}!important`,
                          },
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          height:
                            values?.workplace?.length > 1 ? "auto" : "auto",
                          padding: "0 6px",
                        }),
                        multiValue: (styles) => {
                          return {
                            ...styles,
                            position: "relative",
                            top: "-1px",
                          };
                        },
                        multiValueLabel: (styles) => ({
                          ...styles,
                          padding: "0",
                        }),
                      }}
                      isMulti
                      // isDisabled={singleData}
                      errors={errors}
                      placeholder="Workplace"
                      touched={touched}
                    />
                  </div>
                </div> */}

                <div className="col-lg-2">
                  <button
                    className="btn btn-green btn-green-disable mt-4"
                    type="button"
                    disabled={!values?.filterFromDate || !values?.filterToDate}
                    onClick={(e) => {
                      e.stopPropagation();
                      getLandingData(values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div>
              {rowDto?.length > 0 ? (
                <DataTable
                  bordered
                  data={rowDto?.length > 0 ? rowDto : []}
                  header={salaryGenerateColumn(pages)}
                  onChange={(pagination, filters, sorter, extra) => {
                    if (extra.action === "sort") return;
                    getLandingData(values, pagination);
                    setPages({
                      current: pagination?.current,
                      pageSize: pagination?.pageSize,
                      total: pagination?.total,
                    });
                  }}
                  onRow={(item) => ({
                    onClick: () => {
                      if (true) {
                        history.push({
                          pathname: `/compensationAndBenefits/payrollProcess/advanceSalaryGenerateView/${item?.advanceSalaryCode}`,
                          state: item,
                        });
                      } else {
                        return toast.warning(
                          "Salary Generate on processing. Please wait...",
                          {
                            toastId: 1,
                          }
                        );
                      }
                    },
                    className: "pointer",
                  })}
                  pagination={{
                    current: pages?.current,
                    pageSize: pages?.pageSize,
                    total: pages?.total,
                  }}
                />
              ) : (
                <NoResult title="No result found" />
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default AdvanceSalaryGenerateLanding;
